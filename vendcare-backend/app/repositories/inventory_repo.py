from app.core.models import RefillLog
from typing import List

class InventoryRepository:
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
        # Returns all refills, sorting by date (newest first)
        return await RefillLog.find_all().sort("-date").to_list()

inventory_repo = InventoryRepository()