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
    result = await machine_service.process_dispense(
        identifier=data.identifier, 
        pin=data.pin,
        amount=data.selected_amount,
        product=data.product_name,
        m_id=data.machine_id
    )
    
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["message"])
    
    target_ws = active_machines.get(data.machine_id)
    if target_ws:
        await target_ws.send_json({
            "cmd": "VEND", 
            "slot": result.get("slot_id", 1),
            "ratio": data.selected_amount 
        })
    
    return result

# --- 2. QR METHOD: STEP 1 (Generate Session) ---
@router.post("/create-qr-payment")
async def create_qr_payment(request: PaymentRequest):
    transaction_id = str(uuid.uuid4())
    # Ensure this environment variable is set to your Vercel URL
    frontend_base_url = os.getenv("FRONTEND_URL", "https://final-year-project-f8ym.vercel.app")
    
    active_transactions[transaction_id] = {
        "status": "PENDING",
        "product_id": request.product_id,
        "price": request.price,
        "machine_id": "VEND-UNIT-01"
    }
    
    checkout_url = f"{frontend_base_url}/mobile-vend?tid={transaction_id}&pid={request.product_id}"
    
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
    
    user_result = await machine_service.process_mobile_payment(
        identifier=data.identifier, 
        pin=data.pin,
        amount=txn_data["price"],
        product_id=txn_data["product_id"],
        m_id=txn_data["machine_id"]
    )

    if not user_result["success"]:
        raise HTTPException(status_code=400, detail=user_result["message"])
    
    # Update status for Polling/WebSocket
    txn_data["status"] = "PAID"
    
    # Trigger Hardware
    target_ws = active_machines.get(txn_data["machine_id"])
    if target_ws:
        await target_ws.send_json({
            "cmd": "VEND", 
            "slot": user_result.get("slot_id", 1),
            "ratio": txn_data["price"]
        })
    
    return {"status": "success", "message": "Dispensing..."}

# --- 4. NEW: POLLING ENDPOINT (Fixes the 404 Error) ---
@router.get("/payment-status-check/{tid}")
async def payment_status_check(tid: str):
    """
    Kiosk calls this every 2 seconds to check if status is 'PAID'.
    """
    txn = active_transactions.get(tid)
    if not txn:
        return {"status": "NOT_FOUND"}
    
    current_status = txn["status"]
    
    # Optional: Clean up memory if transaction is finished
    # if current_status == "PAID":
    #     # Don't delete immediately, or polling might miss it. 
    #     # Better to let a background task clean it after 10 minutes.
    #     pass

    return {"status": current_status}

# --- 5. WEBSOCKETS (Keep for local testing, though Vercel blocks them) ---
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
            await websocket.receive_text()
    except WebSocketDisconnect:
        if m_id in active_machines:
            del active_machines[m_id]