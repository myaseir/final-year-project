from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException, Body
from app.api.schemas import DispenseRequest, PaymentRequest, ConfirmPaymentRequest
from app.services.machine_service import machine_service
import uuid
import asyncio
from typing import Dict
import os

router = APIRouter()

# --- Memory Management ---
active_machines: Dict[str, WebSocket] = {}
active_transactions: Dict[str, dict] = {} 

# --- 1. MANUAL METHOD (Identifier + PIN) ---
@router.post("/verify-and-dispense")
async def handle_manual_dispense(data: DispenseRequest):
    # Pass the volume parameter from the request to the service
    result = await machine_service.process_dispense(
        identifier=data.identifier, 
        pin=data.pin,
        product=data.product_name,
        volume=data.volume, # Now supporting precision volume
        m_id=data.machine_id
    )
    
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["message"])
    
    target_ws = active_machines.get(data.machine_id)
    if target_ws:
        # Hardware payload now includes volume for pump duration control
        await target_ws.send_json({
            "cmd": "VEND", 
            "slot": result.get("slot_id", 1),
            "volume": data.volume # IoT hardware uses this for pulse-width timing
        })
    
    return result

# --- 2. QR METHOD: STEP 1 (Generate Session) ---
@router.post("/create-qr-payment")
async def create_qr_payment(request: PaymentRequest):
    transaction_id = str(uuid.uuid4())
    frontend_base_url = os.getenv("FRONTEND_URL", "https://final-year-project-f8ym.vercel.app")
    
    # Store volume in the transaction state so price is locked
    active_transactions[transaction_id] = {
        "status": "PENDING",
        "product_id": request.product_id,
        "price": request.price,
        "volume": request.volume, # Persistent volume state for mobile confirmation
        "machine_id": "VEND-UNIT-01"
    }
    
    # Volume is passed as a query param to the mobile UI for user awareness
    checkout_url = f"{frontend_base_url}/mobile-vend?tid={transaction_id}&pid={request.product_id}&vol={request.volume}"
    
    return {
        "transaction_id": transaction_id,
        "checkout_url": checkout_url
    }

# --- 3. QR METHOD: STEP 2 (Mobile Confirmation) ---
@router.post("/confirm-payment/{transaction_id}")
async def confirm_payment(transaction_id: str, data: ConfirmPaymentRequest):
    if transaction_id not in active_transactions:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    txn_data = active_transactions[transaction_id]
    
    # Mobile payment processing with stored volume
    user_result = await machine_service.process_mobile_payment(
        identifier=data.identifier, 
        pin=data.pin,
        product_id=txn_data["product_id"],
        volume=txn_data["volume"], # Verified server-side
        m_id=txn_data["machine_id"]
    )

    if not user_result["success"]:
        raise HTTPException(status_code=400, detail=user_result["message"])
    
    txn_data["status"] = "PAID"
    
    # Trigger Hardware with precision volume
    target_ws = active_machines.get(txn_data["machine_id"])
    if target_ws:
        await target_ws.send_json({
            "cmd": "VEND", 
            "slot": user_result.get("slot_id", 1),
            "volume": txn_data["volume"] # Command sent to ESP32
        })
    
    return {"status": "success", "message": f"Dispensing {txn_data['volume']}ml..."}

# --- 4. POLLING ENDPOINT ---
@router.get("/payment-status-check/{tid}")
async def payment_status_check(tid: str):
    txn = active_transactions.get(tid)
    if not txn:
        return {"status": "NOT_FOUND"}
    
    return {"status": txn["status"]}

# --- 5. WEBSOCKETS ---
@router.websocket("/payment-status/{tid}")
async def payment_status_ws(websocket: WebSocket, tid: str):
    await websocket.accept()
    try:
        while True:
            txn = active_transactions.get(tid)
            if not txn:
                await websocket.send_json({"status": "EXPIRED"})
                break
            if txn["status"] == "PAID":
                await websocket.send_json({"status": "PAID"})
                break
            await asyncio.sleep(0.5)
    except WebSocketDisconnect:
        pass

@router.websocket("/ws/hardware/{m_id}")
async def hardware_bridge(websocket: WebSocket, m_id: str):
    await websocket.accept()
    active_machines[m_id] = websocket
    try:
        while True:
            # Keep connection alive
            await websocket.receive_text()
    except WebSocketDisconnect:
        if m_id in active_machines:
            del active_machines[m_id]