from app.repositories.user_repo import user_repo
from app.core.models import Purchase, Tank
from datetime import datetime
from typing import Dict, Optional
import uuid

class MachineService:
    PRODUCT_SLOTS = {
        "Midnight Musk": 1, "Aqua Surge": 2, "Ultra Shield": 3,
        "Velvet Glow": 4, "Rose Dew": 5, "Citrus Burst": 6,
        "Vanilla Silk": 7, "Herbal Mint": 8, "Ocean Breeze": 9
    }

    PRICE_RATES = {
        "perfumes": 20.0,
        "moisturizers": 16.67,
        "sunscreens": 16.67
    }

    def _calculate_server_price(self, product_name: str, volume: float) -> int:
        category = "perfumes"
        if product_name in ["Velvet Glow", "Rose Dew", "Citrus Burst"]:
            category = "moisturizers"
        elif product_name in ["Vanilla Silk", "Herbal Mint", "Ocean Breeze"]:
            category = "sunscreens"
            
        rate = self.PRICE_RATES.get(category, 20.0)
        return round(volume * rate)

    async def _deduct_tank_inventory(self, slot_id: int, volume: float):
        tank = await Tank.find_one(Tank.tank_index == slot_id)
        if tank:
            tank.current_level = max(0, tank.current_level - volume)
            await tank.save()
            return True
        return False

    async def process_dispense(self, identifier: str, pin: str, product: str, volume: float, m_id: str):
        slot_id = self.PRODUCT_SLOTS.get(product)
        if not slot_id:
            return {"success": False, "message": f"Product '{product}' not mapped to a slot"}

        # --- NEW: Fetch Tank to get Calibration Factor ---
        tank = await Tank.find_one(Tank.tank_index == slot_id)
        # Default to 1500ms if not found to prevent crashes
        ms_per_ml = getattr(tank, "ms_per_ml", 1500) 
        
        # --- THE MAGIC MATH ---
        duration_ms = int(volume * ms_per_ml)

        required_amount = self._calculate_server_price(product, volume)

        user = await user_repo.get_by_identifier(identifier)
        if not user:
            return {"success": False, "message": "User not found"}
        
        if str(user.pin) != str(pin):
            return {"success": False, "message": "Incorrect 4-digit PIN"}
        
        if user.balance < required_amount:
            return {"success": False, "message": f"Insufficient funds. Required: {required_amount} PKR"}

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

        await self._deduct_tank_inventory(slot_id, volume)
        
        return {
            "success": True, 
            "message": "Dispense authorized", 
            "slot_id": slot_id,
            "volume": volume,
            "duration_ms": duration_ms, # <-- NEW: Sending exact run-time to the hardware!
            "data": {
                "remaining_balance": user.balance,
                "transaction_id": f"TXN-{uuid.uuid4().hex[:8].upper()}"
            }
        }

    async def process_mobile_payment(self, identifier: str, pin: str, product_id: str, volume: float, m_id: str):
        id_to_name = {
            "p1": "Midnight Musk", "p2": "Aqua Surge", "p3": "Ultra Shield",
            "m1": "Velvet Glow", "m2": "Rose Dew", "m3": "Citrus Burst",
            "s1": "Vanilla Silk", "s2": "Herbal Mint", "s3": "Ocean Breeze"
        }
        
        product_name = id_to_name.get(product_id)
        slot_id = self.PRODUCT_SLOTS.get(product_name)

        if not slot_id:
            return {"success": False, "message": "Invalid Product ID"}

        # --- NEW: Fetch Tank to get Calibration Factor ---
        tank = await Tank.find_one(Tank.tank_index == slot_id)
        ms_per_ml = getattr(tank, "ms_per_ml", 1500) 
        duration_ms = int(volume * ms_per_ml)

        required_amount = self._calculate_server_price(product_name, volume)

        user = await user_repo.get_by_identifier(identifier)
        if not user:
            return {"success": False, "message": "User not found"}

        if pin != "SESSION_AUTH" and str(user.pin) != str(pin):
            return {"success": False, "message": "Invalid PIN"}

        if user.balance < required_amount:
            return {"success": False, "message": "Insufficient Wallet Balance"}

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

        await self._deduct_tank_inventory(slot_id, volume)

        return {
            "success": True, 
            "slot_id": slot_id,
            "volume": volume,
            "duration_ms": duration_ms, # <-- NEW: Ensure mobile QR also calculates run-time
            "message": "Mobile payment successful"
        }

machine_service = MachineService()