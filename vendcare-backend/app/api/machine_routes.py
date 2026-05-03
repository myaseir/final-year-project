from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException, Body
from app.api.schemas import DispenseRequest, PaymentRequest, ConfirmPaymentRequest
from app.services.machine_service import machine_service
from app.core.database import get_db # Changed: Import the getter function
import uuid
import asyncio
from typing import Dict
import os

router = APIRouter()

# --- Memory Management (Still used for Frontend, but Hardware uses DB) ---
active_transactions: Dict[str, dict] = {} 

# --- 1. MANUAL METHOD (Identifier + PIN) ---
@router.post("/verify-and-dispense")
async def handle_manual_dispense(data: DispenseRequest):
    # Fetch the live database instance
    db = get_db()
    if db is None:
        raise HTTPException(status_code=500, detail="Database not initialized")

    result = await machine_service.process_dispense(
        identifier=data.identifier, 
        pin=data.pin,
        product=data.product_name,
        volume=data.volume,
        m_id=data.machine_id
    )
    
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["message"])
    
    # NEW: Instead of WebSocket, we push to MongoDB Queue
    dispense_command = {
        "machine_id": data.machine_id,
        "slot": result.get("slot_id", 1),
        "volume": data.volume,
        "status": "pending",
        "timestamp": uuid.uuid4().hex 
    }
    
    # Use the retrieved db instance
    await db.dispense_queue.insert_one(dispense_command)
    
    return result

# --- 2. HARDWARE POLLING ENDPOINT (The ESP32 calls this) ---
@router.get("/check-commands/{m_id}")
async def check_commands(m_id: str):
    """
    ESP32 calls this every 2 seconds. 
    It checks if there is a 'pending' dispense for this machine.
    """
    db = get_db()
    if db is None:
        return {"pending": False}

    # Find and delete the oldest pending command atomically
    command = await db.dispense_queue.find_one_and_delete(
        {"machine_id": m_id, "status": "pending"}
    )
    
    if command:
        return {
            "pending": True, 
            "slot": command["slot"], 
            "volume": command["volume"]
        }
    
    return {"pending": False}

# --- 3. QR METHOD: STEP 1 (Generate Session) ---
@router.post("/create-qr-payment")
async def create_qr_payment(request: PaymentRequest):
    transaction_id = str(uuid.uuid4())
    frontend_base_url = os.getenv("FRONTEND_URL", "https://final-year-project-f8ym.vercel.app")
    
    active_transactions[transaction_id] = {
        "status": "PENDING",
        "product_id": request.product_id,
        "price": request.price,
        "volume": request.volume,
        "machine_id": "VEND-UNIT-01"
    }
    
    checkout_url = f"{frontend_base_url}/mobile-vend?tid={transaction_id}&pid={request.product_id}&vol={request.volume}"
    
    return {
        "transaction_id": transaction_id,
        "checkout_url": checkout_url
    }

# --- 4. QR METHOD: STEP 2 (Mobile Confirmation) ---
@router.post("/confirm-payment/{transaction_id}")
async def confirm_payment(transaction_id: str, data: ConfirmPaymentRequest):
    db = get_db()
    if db is None:
        raise HTTPException(status_code=500, detail="Database not initialized")

    if transaction_id not in active_transactions:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    txn_data = active_transactions[transaction_id]
    
    user_result = await machine_service.process_mobile_payment(
        identifier=data.identifier, 
        pin=data.pin,
        product_id=txn_data["product_id"],
        volume=txn_data["volume"],
        m_id=txn_data["machine_id"]
    )

    if not user_result["success"]:
        raise HTTPException(status_code=400, detail=user_result["message"])
    
    txn_data["status"] = "PAID"
    
    # Push to MongoDB Queue for QR Payment
    await db.dispense_queue.insert_one({
        "machine_id": txn_data["machine_id"],
        "slot": user_result.get("slot_id", 1),
        "volume": txn_data["volume"],
        "status": "pending"
    })
    
    return {"status": "success", "message": f"Dispensing {txn_data['volume']}ml..."}

# --- 5. LEGACY WEB UI STATUS ---
@router.get("/payment-status-check/{tid}")
async def payment_status_check(tid: str):
    txn = active_transactions.get(tid)
    return {"status": txn["status"]} if txn else {"status": "NOT_FOUND"}