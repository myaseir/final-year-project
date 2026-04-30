from app.repositories.user_repo import user_repo
from app.core.models import User, TopUpRequest
from datetime import datetime

class UserService:
    async def register_user(self, data: dict):
        if await user_repo.get_by_cnic(data["cnic"]):
            return {"success": False, "message": "CNIC already registered"}
        if await user_repo.get_by_email(data["email"]):
            return {"success": False, "message": "Email already registered"}
        
        new_user = User(**data)
        await user_repo.save_user(new_user)
        return {"success": True, "message": "Registration successful"}

    async def login_user(self, identifier: str, pin: str):
    # Update this query to check both fields
        user = await User.find_one({
            "$or": [
                {"cnic": identifier},
                {"email": identifier}
            ]
        })

        if not user:
            return {"success": False, "message": "Invalid Credentials"}

        if str(user.pin) != str(pin):
            return {"success": False, "message": "Invalid Credentials"}

        return {
            "success": True, 
            "user": user, 
            "message": "Login successful"
        }

    async def get_profile(self, identifier: str):
    # Find user by either email or cnic
        return await User.find_one({
            "$or": [
                {"cnic": identifier},
                {"email": identifier}
            ]
        })

    async def request_topup(self, cnic: str, amount: int, ref_id: str):
        user = await user_repo.get_by_cnic(cnic)
        if not user: return {"success": False, "message": "User not found"}
        
        new_req = TopUpRequest(
            reference_id=ref_id,
            amount=amount,
            date=datetime.now().strftime("%Y-%m-%d %H:%M")
        )
        user.pending_topups.append(new_req)
        await user_repo.update_user(user)
        return {"success": True}

user_service = UserService()