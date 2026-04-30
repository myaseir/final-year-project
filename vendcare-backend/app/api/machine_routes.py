from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException, Body
from app.api.schemas import DispenseRequest, PaymentRequest
from app.services.machine_service import machine_service
import uuid
import asyncio
from typing import Dict
import os
router = APIRouter()

# --- Memory Management ---
active_machines: Dict[str, WebSocket] = {}
# Stores temporary session data for QR payments: { tid: {"status": str, "pid": str, "amount": int, "m_id": str} }
active_transactions: Dict[str, dict] = {} 

# --- 1. MANUAL METHOD (CNIC + PIN) ---
@router.post("/verify-and-dispense")
async def handle_manual_dispense(data: DispenseRequest):
    # 1. Deduct from wallet and log history
    result = await machine_service.process_dispense(
        cnic=data.cnic,
        pin=data.pin,
        amount=data.selected_amount,
        product=data.product_name,
        m_id=data.machine_id
    )
    
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["message"])
    
    # 2. Immediate Hardware Trigger
    target_ws = active_machines.get(data.machine_id)
    if target_ws:
        await target_ws.send_json({
            "cmd": "VEND", 
            "slot": result.get("slot_id", 1),
            "ratio": data.selected_amount # Pass PKR as the dispensing ratio
        })
    
    return result

# --- 2. QR METHOD: STEP 1 (Generate Session) ---
@router.post("/create-qr-payment")
async def create_qr_payment(request: PaymentRequest):
    transaction_id = str(uuid.uuid4())
    
    # 1. Fetch the URL from environment variables
    # 2. Provide a default fallback for local development
    frontend_base_url = os.getenv("FRONTEND_URL", "http://127.0.0.1:3000")
    
    # Store session details
    active_transactions[transaction_id] = {
        "status": "PENDING",
        "product_id": request.product_id,
        "price": request.price,
        "machine_id": "VEND-UNIT-01"
    }
    
    # 3. Construct the dynamic checkout URL
    checkout_url = f"{frontend_base_url}/mobile-vend?tid={transaction_id}&pid={request.product_id}"
    
    return {
        "transaction_id": transaction_id,
        "checkout_url": checkout_url
    }

# --- 3. QR METHOD: STEP 2 (Mobile Confirmation & Wallet Deduction) ---
@router.post("/confirm-payment/{transaction_id}")
async def confirm_payment(transaction_id: str, cnic: str = Body(..., embed=True)):
    if transaction_id not in active_transactions:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    txn_data = active_transactions[transaction_id]
    
    # 1. Logic to deduct balance from the user who scanned the QR
    # We use a PIN-less version or a 'mobile-authorized' check here
    user_result = await machine_service.process_mobile_payment(
        cnic=cnic,
        amount=txn_data["price"],
        product_id=txn_data["product_id"],
        m_id=txn_data["machine_id"]
    )

    if not user_result["success"]:
        raise HTTPException(status_code=400, detail=user_result["message"])
    
    # 2. Update status for Kiosk WebSocket
    txn_data["status"] = "PAID"
    
    # 3. Trigger Hardware
    target_ws = active_machines.get(txn_data["machine_id"])
    if target_ws:
        await target_ws.send_json({
            "cmd": "VEND", 
            "slot": user_result.get("slot_id", 1),
            "ratio": txn_data["price"]
        })
    
    return {"status": "success", "message": "Dispensing..."}

# --- 4. WEBSOCKETS ---
@router.websocket("/payment-status/{tid}")
async def payment_status_ws(websocket: WebSocket, tid: str):
    await websocket.accept()
    try:
        while True:
            txn = active_transactions.get(tid)
            if txn and txn["status"] == "PAID":
                await websocket.send_json({"status": "PAID"})
                break
            await asyncio.sleep(1)
    except WebSocketDisconnect:
        pass

@router.websocket("/ws/hardware/{m_id}")
async def hardware_bridge(websocket: WebSocket, m_id: str):
    await websocket.accept()
    active_machines[m_id] = websocket
    try:
        while True:
            await websocket.receive_text() # Heartbeat
    except WebSocketDisconnect:
        if m_id in active_machines:
            del active_machines[m_id]