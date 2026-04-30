from app.repositories.user_repo import user_repo
from app.core.models import User, TopUpRequest
from datetime import datetime

class UserService:
    async def register_user(self, data: dict):
        # 1. Standard duplicate checks using specific fields
        if await user_repo.get_by_cnic(data["cnic"]):
            return {"success": False, "message": "CNIC already registered"}
        if await user_repo.get_by_email(data["email"]):
            return {"success": False, "message": "Email already registered"}
        
        new_user = User(**data)
        await user_repo.save_user(new_user)
        return {"success": True, "message": "Registration successful"}

    async def login_user(self, identifier: str, pin: str):
        # 2. FIX: Check both fields to support Email or CNIC login
        user = await user_repo.get_by_identifier(identifier)

        if not user:
            return {"success": False, "message": "Invalid Credentials"}

        # Use str() comparison to avoid type mismatch issues with PIN
        if str(user.pin) != str(pin):
            return {"success": False, "message": "Invalid Credentials"}

        return {
            "success": True, 
            "user": user, 
            "message": "Login successful"
        }

    async def get_profile(self, identifier: str):
        # 3. FIX: Standardize profile fetching using the same identifier logic
        return await user_repo.get_by_identifier(identifier)

    async def request_topup(self, identifier: str, amount: int, ref_id: str):
        # 4. FIX: Allow top-up requests via Email or CNIC
        user = await user_repo.get_by_identifier(identifier)
        if not user: 
            return {"success": False, "message": "User not found"}
        
        new_req = TopUpRequest(
            reference_id=ref_id,
            amount=amount,
            date=datetime.now().strftime("%Y-%m-%d %H:%M")
        )
        
        # Ensure pending_topups list exists
        if user.pending_topups is None:
            user.pending_topups = []
            
        user.pending_topups.append(new_req)
        await user_repo.update_user(user)
        return {"success": True}

user_service = UserService()