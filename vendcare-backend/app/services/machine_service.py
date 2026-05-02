from app.repositories.user_repo import user_repo
from app.core.models import Purchase, Tank
from datetime import datetime
from typing import Dict, Optional
import uuid

class MachineService:
    # 1. PRODUCT REGISTRY: Maps exact database names to hardware slot IDs
    PRODUCT_SLOTS = {
        "Midnight Musk": 1, "Aqua Surge": 2, "Ultra Shield": 3,
        "Velvet Glow": 4, "Rose Dew": 5, "Citrus Burst": 6,
        "Vanilla Silk": 7, "Herbal Mint": 8, "Ocean Breeze": 9
    }

    # 2. PRICE RATES: PKR per 1ml
    PRICE_RATES = {
        "perfumes": 20.0,
        "moisturizers": 16.67,
        "sunscreens": 16.67
    }

    def _calculate_server_price(self, product_name: str, volume: float) -> int:
        """Helper to verify price based on synchronized product names."""
        category = "perfumes"
        
        # Matches Slots 4, 5, 6 (Moisturizers)[cite: 8]
        if product_name in ["Velvet Glow", "Rose Dew", "Citrus Burst"]:
            category = "moisturizers"
        # Matches Slots 7, 8, 9 (Sunscreens)[cite: 8]
        elif product_name in ["Vanilla Silk", "Herbal Mint", "Ocean Breeze"]:
            category = "sunscreens"
        # Slots 1, 2, 3 default to "perfumes"[cite: 8]
            
        rate = self.PRICE_RATES.get(category, 20.0)
        return round(volume * rate)

    async def _deduct_tank_inventory(self, slot_id: int, volume: float):
        """
        Decreases the physical fluid level in MongoDB based on dispensed volume.
        This is the critical link for the Admin Panel display[cite: 8].
        """
        # Find the tank matching the hardware slot index[cite: 8]
        tank = await Tank.find_one(Tank.tank_index == slot_id)
        if tank:
            # Subtract the dispensed volume (ml)[cite: 8]
            tank.current_level = max(0, tank.current_level - volume)
            await tank.save()
            return True
        return False

    async def process_dispense(self, identifier: str, pin: str, product: str, volume: float, m_id: str):
        """Handles physical machine interaction via identifier and PIN[cite: 2, 8]."""
        slot_id = self.PRODUCT_SLOTS.get(product)
        if not slot_id:
            return {"success": False, "message": f"Product '{product}' not mapped to a slot"}

        # Calculate required amount on server to prevent manipulation[cite: 8]
        required_amount = self._calculate_server_price(product, volume)

        user = await user_repo.get_by_identifier(identifier)
        if not user:
            return {"success": False, "message": "User not found"}
        
        if str(user.pin) != str(pin):
            return {"success": False, "message": "Incorrect 4-digit PIN"}
        
        if user.balance < required_amount:
            return {"success": False, "message": f"Insufficient funds. Required: {required_amount} PKR"}

        # --- DATABASE UPDATES ---
        # 1. Update User Balance & History[cite: 8]
        user.balance -= required_amount
        user.history.append(Purchase(
            product_name=product,
            amount=required_amount, 
            volume=volume,
            date=datetime.now().strftime("%Y-%m-%d %H:%M"),
            machine_id=m_id,
            type="debit"
        ))
        await user_repo.update_user(user)

        # 2. Update Tank Fluid Level (The missing link for Admin levels)[cite: 8]
        await self._deduct_tank_inventory(slot_id, volume)
        
        return {
            "success": True, 
            "message": "Dispense authorized", 
            "slot_id": slot_id,
            "volume": volume,
            "data": {
                "remaining_balance": user.balance,
                "transaction_id": f"TXN-{uuid.uuid4().hex[:8].upper()}"
            }
        }

    async def process_mobile_payment(self, identifier: str, pin: str, product_id: str, volume: float, m_id: str):
        """Handles wallet deduction for QR/Mobile scans[cite: 2, 8]."""
        # Synchronized with User Frontend IDs[cite: 8]
        id_to_name = {
            "p1": "Midnight Musk", "p2": "Aqua Surge", "p3": "Ultra Shield",
            "m1": "Velvet Glow", "m2": "Rose Dew", "m3": "Citrus Burst",
            "s1": "Vanilla Silk", "s2": "Herbal Mint", "s3": "Ocean Breeze"
        }
        
        product_name = id_to_name.get(product_id)
        slot_id = self.PRODUCT_SLOTS.get(product_name)

        if not slot_id:
            return {"success": False, "message": "Invalid Product ID"}

        required_amount = self._calculate_server_price(product_name, volume)

        user = await user_repo.get_by_identifier(identifier)
        if not user:
            return {"success": False, "message": "User not found"}

        if pin != "SESSION_AUTH" and str(user.pin) != str(pin):
            return {"success": False, "message": "Invalid PIN"}

        if user.balance < required_amount:
            return {"success": False, "message": "Insufficient Wallet Balance"}

        # --- DATABASE UPDATES ---
        # 1. Update User Balance & History[cite: 8]
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

        # 2. Update Tank Inventory[cite: 8]
        await self._deduct_tank_inventory(slot_id, volume)

        return {
            "success": True, 
            "slot_id": slot_id,
            "volume": volume,
            "message": "Mobile payment successful"
        }

machine_service = MachineService()