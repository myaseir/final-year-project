from app.repositories.user_repo import user_repo
from app.core.models import Purchase
from datetime import datetime
from typing import Dict, Optional
import uuid

class MachineService:
    # 1. PRODUCT REGISTRY: Mapped to your Next.js CONTENT_MAP names
    PRODUCT_SLOTS = {
        "Floral Breeze": 1, "Midnight Musk": 2, "Oceanic Mist": 3,
        "Aqua Surge": 4, "Velvet Glow": 5, "Rain Drop": 6,
        "Ultra Shield": 7, "Beach Guard": 8, "Daily Beam": 9
    }

    async def process_dispense(self, identifier: str, pin: str, amount: int, product: str, m_id: str):
        """
        Handles physical machine interaction (Manual Method).
        Updated to use identifier (Email or CNIC).
        """
        slot_id = self.PRODUCT_SLOTS.get(product)
        if not slot_id:
            return {"success": False, "message": f"Product '{product}' not mapped to a slot"}

        # Use the updated repository method
        user = await user_repo.get_by_identifier(identifier)
        if not user:
            return {"success": False, "message": "User not found"}
        
        # Ensure PIN comparison handles potential type mismatches
        if str(user.pin) != str(pin):
            return {"success": False, "message": "Incorrect 4-digit PIN"}
        
        if user.balance < amount:
            return {"success": False, "message": f"Insufficient funds. Balance: {user.balance} PKR"}

        # Perform Deduction
        user.balance -= amount
        
        new_purchase = Purchase(
            product_name=product,
            amount=amount, 
            date=datetime.now().strftime("%Y-%m-%d %H:%M"),
            machine_id=m_id
        )
        
        user.history.append(new_purchase)
        await user_repo.update_user(user)
        
        return {
            "success": True, 
            "message": "Dispense authorized", 
            "slot_id": slot_id,
            "data": {
                "remaining_balance": user.balance,
                "transaction_id": f"TXN-{uuid.uuid4().hex[:8].upper()}"
            }
        }

    async def process_mobile_payment(self, identifier: str, pin: str, amount: int, product_id: str, m_id: str):
        """
        Handles the wallet deduction for QR/Mobile scans.
        Updated to support identifier and PIN verification.
        """
        id_to_name = {
            "p1": "Floral Breeze", "p2": "Midnight Musk", "p3": "Oceanic Mist",
            "m1": "Aqua Surge", "m2": "Velvet Glow", "m3": "Rain Drop",
            "s1": "Ultra Shield", "s2": "Beach Guard", "s3": "Daily Beam"
        }
        
        product_name = id_to_name.get(product_id)
        slot_id = self.PRODUCT_SLOTS.get(product_name)

        if not slot_id:
            return {"success": False, "message": "Invalid Product ID"}

        # Find user by Email or CNIC
        user = await user_repo.get_by_identifier(identifier)
        if not user:
            return {"success": False, "message": "User not found"}

        # 2. Logic to handle Auto-Pay vs Guest Login PIN check
        if pin != "SESSION_AUTH" and str(user.pin) != str(pin):
            return {"success": False, "message": "Invalid PIN"}

        if user.balance < amount:
            return {"success": False, "message": "Insufficient Wallet Balance"}

        # Deduct and Update
        user.balance -= amount
        user.history.append(Purchase(
            product_name=product_name,
            amount=amount,
            date=datetime.now().strftime("%Y-%m-%d %H:%M"),
            machine_id=m_id
        ))
        
        await user_repo.update_user(user)

        return {
            "success": True, 
            "slot_id": slot_id,
            "message": "Mobile payment successful"
        }

machine_service = MachineService()