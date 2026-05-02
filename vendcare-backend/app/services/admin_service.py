from app.repositories.user_repo import user_repo
from datetime import datetime
from app.core.models import User
from collections import Counter, defaultdict

class AdminService:
    async def get_all_pending_requests(self):
        """
        Fetches all pending top-up requests across the system.
        Optimized for Beanie/MongoDB.
        """
        # Fetch users where the pending_topups list is not empty
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
        # Sort by date so admin sees newest requests first
        return sorted(results, key=lambda x: x['date'], reverse=True)

    async def approve_topup(self, cnic: str, ref_id: str):
        """
        Approves a top-up, updates balance, and logs the transaction.
        """
        user = await user_repo.get_by_cnic(cnic)
        if not user: 
            return {"success": False, "message": "User not found"}

        request_to_approve = None
        for req in user.pending_topups:
            if req.reference_id == ref_id:
                request_to_approve = req
                break
        
        if request_to_approve:
            # 1. Update Balance
            user.balance += request_to_approve.amount
            
            # 2. Record in Transaction History
            user.history.append({
                "product_name": "Wallet Top-up",
                "machine_id": "ADMIN-PANEL",
                "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "amount": request_to_approve.amount,
                "volume": 0.0, # Credit transactions have no fluid volume
                "type": "credit" 
            })
            
            # 3. Remove from Pending
            user.pending_topups.remove(request_to_approve)
            
            # 4. Save to MongoDB
            await user_repo.update_user(user)
            return {"success": True, "new_balance": user.balance}
        
        return {"success": False, "message": "Reference ID not found"}
    
    async def get_dashboard_analytics(self):
        """
        Comprehensive analytics including volume trends and dynamic revenue.
        """
        users = await User.find_all().to_list()
        
        user_spending = Counter()
        product_sales = Counter()
        product_volumes = defaultdict(list)
        total_revenue = 0
        total_ml_dispensed = 0

        for user in users:
            for txn in user.history:
                txn_type = getattr(txn, "type", None)
                
                # We analyze 'debit' (vending) actions
                if txn_type != "credit":
                    amount = getattr(txn, "amount", 0)
                    volume = getattr(txn, "volume", 0.0)
                    product_name = getattr(txn, "product_name", "Unknown")
                    
                    total_revenue += amount
                    total_ml_dispensed += volume
                    
                    product_sales[product_name] += 1
                    user_spending[user.full_name] += amount
                    
                    # Track volume per product to find average concentration preferences
                    if volume > 0:
                        product_volumes[product_name].append(volume)

        # Calculate Average Volume per Product
        avg_volumes = []
        for prod, vols in product_volumes.items():
            avg_volumes.append({
                "name": prod,
                "avg_ml": round(sum(vols) / len(vols), 2)
            })

        # Format Data for Recharts
        top_products = [{"name": k, "value": v} for k, v in product_sales.most_common(5)]
        top_customers = [{"name": k, "value": v} for k, v in user_spending.most_common(5)]
        
        # Profit Logic: (Revenue - Estimated Cost of Fluid)
        # Assuming avg cost of 5 PKR per 1ml across categories
        estimated_cost = total_ml_dispensed * 5
        estimated_profit = total_revenue - estimated_cost

        return {
            "total_revenue": total_revenue,
            "estimated_profit": max(0, estimated_profit),
            "total_volume_dispensed": round(total_ml_dispensed, 1),
            "top_products": top_products,
            "top_customers": top_customers,
            "volume_analysis": avg_volumes,
            "suggestions": self.generate_inventory_suggestions(product_sales, product_volumes)
        }

    def generate_inventory_suggestions(self, product_sales, product_volumes):
        if not product_sales:
            return ["No transaction data available yet."]
        
        most_popular = product_sales.most_common(1)[0][0]
        
        # Check if users are preferring high or low volumes
        all_vols = [v for sublist in product_volumes.values() for v in sublist]
        avg_system_vol = sum(all_vols) / len(all_vols) if all_vols else 0
        
        suggestions = [f"Restock {most_popular} — it represents your highest transaction count."]
        
        if avg_system_vol > 5.0:
            suggestions.append("Users prefer larger doses. Monitor tank levels closely.")
        else:
            suggestions.append("Users prefer small 'puffs'. High-frequency pump wear expected.")
            
        suggestions.append(f"System has dispensed {round(sum(all_vols), 1)}ml total since last reset.")
        
        return suggestions

admin_service = AdminService()