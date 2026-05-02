from app.core.models import User
from typing import Optional

class UserRepository:
    # --- NEW: Unified Identifier Lookup ---
    async def get_by_identifier(self, identifier: str) -> Optional[User]:
        """
        Finds a user by either Email or CNIC. 
        Essential for dual-login support.
        """
        return await User.find_one({
            "$or": [
                {"cnic": identifier},
                {"email": identifier}
            ]
        })

    async def get_by_cnic(self, cnic: str) -> Optional[User]:
        return await User.find_one(User.cnic == cnic)

    async def get_by_email(self, email: str) -> Optional[User]:
        return await User.find_one(User.email == email)

    async def save_user(self, user: User):
        await user.insert()

    async def update_user(self, user: User):
        # Beanie's .save() handles the update if the ID exists
        await user.save()

    async def add_purchase_to_history(self, identifier: str, purchase_data):
        """
        Updates the purchase history array using either CNIC or Email.
        """
        user = await self.get_by_identifier(identifier)
        if user:
            await user.update({"$push": {"history": purchase_data}})

    async def deduct_balance_and_log(self, identifier: str, amount: int, purchase_data):
        """
        Atomic operation: Deducts balance and adds to history in one go.
        Uses the flexible identifier to find the correct user account.
        """
        # We perform the update on the specific user found by identifier
        target_user = await self.get_by_identifier(identifier)
        if target_user:
            return await target_user.update(
                {
                    "$inc": {"balance": -amount},
                    "$push": {"history": purchase_data}
                }
            )
        return None
    
    async def get_total_volume_dispensed(self) -> float:
        """
        Uses MongoDB Aggregation to calculate total volume instantly,
        without loading thousands of user documents into server memory.
        """
        pipeline = [
            {"$unwind": "$history"}, # Break out the history array
            {"$match": {"history.type": "debit"}}, # Only look at purchases
            {"$group": {
                "_id": None, 
                "total_ml": {"$sum": "$history.volume"} # Sum up the volume
            }}
        ]
        
        result = await User.aggregate(pipeline).to_list()
        if result:
            return result[0].get("total_ml", 0.0)
        return 0.0

user_repo = UserRepository()