from app.repositories.user_repo import user_repo

class AdminService:
    async def get_all_pending_requests(self):
        # We fetch users who have at least one item in pending_topups
        # Professional tip: In MongoDB we use the $exists or $ne operator
        from app.core.models import User
        pending_users = await User.find(User.pending_topups != []).to_list()
        
        results = []
        for user in pending_users:
            for req in user.pending_topups:
                results.append({
                    "cnic": user.cnic,
                    "full_name": user.full_name,
                    "amount": req.amount,
                    "reference_id": req.reference_id,
                    "date": req.date
                })
        return results

    async def approve_topup(self, cnic: str, ref_id: str):
        user = await user_repo.get_by_cnic(cnic)
        if not user: return {"success": False}

        for req in user.pending_topups:
            if req.reference_id == ref_id:
                # Add balance and record in main history as a 'Deposit'
                user.balance += req.amount
                user.pending_topups.remove(req)
                
                await user_repo.update_user(user)
                return {"success": True}
        
        return {"success": False}

admin_service = AdminService()