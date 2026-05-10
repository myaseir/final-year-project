from app.core.models import RefillLog, Tank  # <-- Added Tank to imports
from typing import List, Optional            # <-- Added Optional

class InventoryRepository:
    
    # --- EXISTING REFILL METHODS ---
    async def log_refill(self, refill_data: RefillLog) -> RefillLog:
        """
        Saves a manual refill record to the database.
        """
        await refill_data.insert()
        return refill_data

    async def get_all_refills(self) -> List[RefillLog]:
        """
        Fetches all refill history to calculate theoretical tank levels.
        """
        return await RefillLog.find_all().sort("-date").to_list()

    # --- NEW: TANK MANAGEMENT FOR HARDWARE CALIBRATION ---
    
    async def get_tank_by_product(self, product_name: str) -> Optional[Tank]:
        """
        Fetches a specific tank. We need this to get the ms_per_ml
        calibration factor for the hardware duration calculation.
        """
        return await Tank.find_one(Tank.product_name == product_name)

    async def deduct_tank_volume(self, product_name: str, volume_dispensed: float) -> bool:
        """
        Updates the physical inventory level in real-time.
        Called after the hardware successfully dispenses the fluid.
        """
        tank = await self.get_tank_by_product(product_name)
        if tank:
            # We use Beanie's update to atomically decrement the fluid level
            await tank.update({"$inc": {"current_level": -volume_dispensed}})
            return True
        return False

inventory_repo = InventoryRepository()