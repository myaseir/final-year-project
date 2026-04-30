from app.core.models import User
from typing import Optional

class UserRepository:
    async def get_by_cnic(self, cnic: str) -> Optional[User]:
        return await User.find_one(User.cnic == cnic)

    async def get_by_email(self, email: str) -> Optional[User]:
        return await User.find_one(User.email == email)

    async def save_user(self, user: User):
        await user.insert()

    async def update_user(self, user: User):
        # Beanie's .save() handles the update if the ID exists
        await user.save()

    async def add_purchase_to_history(self, cnic: str, purchase_data):
        """
        Updates the purchase history array directly in MongoDB.
        """
        await User.find_one(User.cnic == cnic).update(
            {"$push": {"history": purchase_data}}
        )

    # --- ADD THIS FOR VENDCARE SECURITY ---
    async def deduct_balance_and_log(self, cnic: str, amount: int, purchase_data):
        """
        Atomic operation: Deducts balance and adds to history in one go.
        This is the most professional way to handle IoT payments.
        """
        return await User.find_one(User.cnic == cnic).update(
            {
                "$inc": {"balance": -amount},
                "$push": {"history": purchase_data}
            }
        )

user_repo = UserRepository()