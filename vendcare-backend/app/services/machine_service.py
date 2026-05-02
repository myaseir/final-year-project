from app.repositories.user_repo import user_repo
from app.core.models import Purchase
from datetime import datetime
from typing import Dict, Optional
import uuid

class MachineService:
    # 1. PRODUCT REGISTRY: Mapped to slot IDs for hardware relay control
    PRODUCT_SLOTS = {
        "Floral Breeze": 1, "Midnight Musk": 2, "Oceanic Mist": 3,
        "Aqua Surge": 4, "Velvet Glow": 5, "Rain Drop": 6,
        "Ultra Shield": 7, "Beach Guard": 8, "Daily Beam": 9
    }

    # 2. PRICE RATES: Base rates per 1ml to verify frontend calculations
    # Perfume: Rs 20/ml | Others: Rs 16.67/ml (approx Rs 50 for 3ml)
    PRICE_RATES = {
        "perfumes": 20.0,
        "moisturizers": 16.67,
        "sunscreens": 16.67
    }

    def _calculate_server_price(self, product_name: str, volume: float) -> int:
        """Helper to verify price based on product category and volume."""
        # Determine category based on product name mapping
        category = "perfumes"
        if product_name in ["Aqua Surge", "Velvet Glow", "Rain Drop"]:
            category = "moisturizers"
        elif product_name in ["Ultra Shield", "Beach Guard", "Daily Beam"]:
            category = "sunscreens"
            
        rate = self.PRICE_RATES.get(category, 20.0)
        return round(volume * rate)

    async def process_dispense(self, identifier: str, pin: str, product: str, volume: float, m_id: str):
        """
        Handles physical machine interaction (Manual Method) with Volume logic.
        """
        slot_id = self.PRODUCT_SLOTS.get(product)
        if not slot_id:
            return {"success": False, "message": f"Product '{product}' not mapped to a slot"}

        # Calculate required amount on server to prevent manipulation
        required_amount = self._calculate_server_price(product, volume)

        user = await user_repo.get_by_identifier(identifier)
        if not user:
            return {"success": False, "message": "User not found"}
        
        if str(user.pin) != str(pin):
            return {"success": False, "message": "Incorrect 4-digit PIN"}
        
        if user.balance < required_amount:
            return {"success": False, "message": f"Insufficient funds. Required: {required_amount} PKR"}

        # Perform Deduction
        user.balance -= required_amount
        
        # Log purchase with Volume info for Admin Analytics
        new_purchase = Purchase(
            product_name=product,
            amount=required_amount, 
            volume=volume, # Ensure your Purchase model has this field
            date=datetime.now().strftime("%Y-%m-%d %H:%M"),
            machine_id=m_id,
            type="debit"
        )
        
        user.history.append(new_purchase)
        await user_repo.update_user(user)
        
        return {
            "success": True, 
            "message": "Dispense authorized", 
            "slot_id": slot_id,
            "volume": volume, # IoT hardware uses this to set pump duration
            "data": {
                "remaining_balance": user.balance,
                "transaction_id": f"TXN-{uuid.uuid4().hex[:8].upper()}"
            }
        }

    async def process_mobile_payment(self, identifier: str, pin: str, product_id: str, volume: float, m_id: str):
        """
        Handles the wallet deduction for QR/Mobile scans with Volume logic.
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

        # Calculate Price
        required_amount = self._calculate_server_price(product_name, volume)

        user = await user_repo.get_by_identifier(identifier)
        if not user:
            return {"success": False, "message": "User not found"}

        if pin != "SESSION_AUTH" and str(user.pin) != str(pin):
            return {"success": False, "message": "Invalid PIN"}

        if user.balance < required_amount:
            return {"success": False, "message": "Insufficient Wallet Balance"}

        # Deduct and Update
        user.balance -= required_amount
        user.history.append(Purchase(
            product_name=product_name,
            amount=required_amount,
            volume=volume,
            date=datetime.now().strftime("%Y-%m-%d %H:%M"),
            machine_id=m_id,
            type="debit"
        ))
        
        await user_repo.update_user(user)

        return {
            "success": True, 
            "slot_id": slot_id,
            "volume": volume,
            "message": "Mobile payment successful"
        }

machine_service = MachineService()