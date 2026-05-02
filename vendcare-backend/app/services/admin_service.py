from app.repositories.user_repo import user_repo
from datetime import datetime
from app.core.models import User, Tank, RefillLog
from collections import Counter, defaultdict
from app.repositories.inventory_repo import inventory_repo

class AdminService:
    # --- WALLET & TOP-UP MANAGEMENT ---

    async def get_all_pending_requests(self):
        """
        Fetches all user top-up requests currently awaiting approval[cite: 1, 7].
        """
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
        return sorted(results, key=lambda x: x['date'], reverse=True)

    async def approve_topup(self, cnic: str, ref_id: str):
        """
        Approves a specific wallet top-up and updates the user's history[cite: 1, 7].
        """
        user = await user_repo.get_by_cnic(cnic)
        if not user: 
            return {"success": False, "message": "User not found"}
        
        request_to_approve = next((r for r in user.pending_topups if r.reference_id == ref_id), None)
        
        if request_to_approve:
            user.balance += request_to_approve.amount
            user.history.append({
                "product_name": "Wallet Top-up",
                "machine_id": "ADMIN-PANEL",
                "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "amount": request_to_approve.amount,
                "volume": 0.0,
                "type": "credit" 
            })
            user.pending_topups.remove(request_to_approve)
            await user_repo.update_user(user)
            return {"success": True, "new_balance": user.balance}
        return {"success": False, "message": "Reference ID not found"}

    # --- INVENTORY & TELEMETRY ---

    async def get_all_tanks(self):
        """
        Fetches tanks with Glacia Labs' color schemes:
        Pink (#E29595): Perfumes | Blue (#a7c7d8): Moisturizers | Purple (#d8b4e2): Sunscreens[cite: 7].
        """
        tanks = await Tank.find_all().to_list()
        categorized_tanks = []
        
        for tank in tanks:
            # Assign colors and categories based on tank index or name
            if "Perfume" in tank.product_name or tank.tank_index in [1, 2, 3]:
                color = "#E29595"
                cat = "Perfumes"
            elif "Moisturizer" in tank.product_name or tank.tank_index in [4, 5, 6]:
                color = "#a7c7d8"
                cat = "Moisturizers"
            else:
                color = "#d8b4e2"
                cat = "Sunscreens"

            categorized_tanks.append({
                "id": tank.tank_index,
                "name": tank.product_name,
                "max": tank.max_capacity,
                "current": round(tank.current_level, 1),
                "color": color,
                "category": cat
            })
        return categorized_tanks

    async def process_refill(self, target: str | int):
        """
        Resets fluid levels to max and logs the action for auditing[cite: 1, 7].
        """
        try:
            if target == 'all':
                tanks = await Tank.find_all().to_list()
                for tank in tanks:
                    await self._execute_tank_refill(tank)
            else:
                tank = await Tank.find_one(Tank.tank_index == int(target))
                if tank:
                    await self._execute_tank_refill(tank)
                else:
                    return False
            return True
        except Exception as e:
            print(f"Refill error: {e}")
            return False

    async def _execute_tank_refill(self, tank):
        """Internal helper to update level and log the refill event[cite: 7]."""
        previous_level = tank.current_level
        tank.current_level = tank.max_capacity
        await tank.save()

        new_log = RefillLog(
            product_name=tank.product_name,
            volume_added_ml=tank.max_capacity - previous_level,
            date=datetime.now().strftime("%Y-%m-%d %H:%M")
        )
        await inventory_repo.log_refill(new_log)

    # --- ADVANCED ANALYTICS ---

    async def get_dashboard_analytics(self):
        """
        Aggregates sales, volume, and peak hour data for dashboard graphs[cite: 1, 7].
        """
        users = await User.find_all().to_list()
        user_spending = Counter()
        product_sales = Counter()
        product_volumes = defaultdict(list)
        total_revenue = 0
        total_ml_dispensed = 0

        for user in users:
            for txn in user.history:
                if getattr(txn, "type", "") == "debit":
                    amount = getattr(txn, "amount", 0)
                    volume = getattr(txn, "volume", 0.0)
                    product_name = getattr(txn, "product_name", "Unknown")
                    
                    total_revenue += amount
                    total_ml_dispensed += volume
                    product_sales[product_name] += 1
                    user_spending[user.full_name] += amount
                    if volume > 0:
                        product_volumes[product_name].append(volume)

        return {
            "total_revenue": total_revenue,
            "estimated_profit": max(0, total_revenue - (total_ml_dispensed * 5)),
            "total_volume_dispensed": round(total_ml_dispensed, 1),
            "top_customers": [{"name": k, "value": v} for k, v in user_spending.most_common(5)],
            "volume_analysis": [{"name": p, "avg_ml": round(sum(v)/len(v), 2)} for p, v in product_volumes.items()],
            "peak_hours": await self.get_peak_hours_analysis(),
            "suggestions": self.generate_inventory_suggestions(product_sales, product_volumes)
        }

    async def get_peak_hours_analysis(self):
        """Analyzes transaction dates to find high-traffic hours[cite: 7]."""
        users = await User.find_all().to_list()
        hourly_counts = Counter()
        for user in users:
            for txn in user.history:
                if getattr(txn, "type", "") == "debit":
                    try:
                        dt = datetime.strptime(txn.date, "%Y-%m-%d %H:%M")
                        hourly_counts[dt.hour] += 1
                    except: continue 
        
        return [{"time": f"{h%12 or 12} {'AM' if h < 12 else 'PM'}", "vends": hourly_counts[h]} for h in range(24)]

    def generate_inventory_suggestions(self, product_sales, product_volumes):
        """AI-driven suggestions based on sales patterns[cite: 7]."""
        if not product_sales:
            return ["Awaiting initial telemetry data..."]
        
        most_popular = product_sales.most_common(1)[0][0]
        all_vols = [v for sublist in product_volumes.values() for v in sublist]
        avg_system_vol = sum(all_vols) / len(all_vols) if all_vols else 0
        
        suggestions = [f"Demand Spike: {most_popular} is trending."]
        if avg_system_vol > 5.0:
            suggestions.append("Users prefer high-dosage sessions. Increase refill frequency.")
        else:
            suggestions.append("Micro-dosing detected. Optimize pump pulses for precision.")
        return suggestions

admin_service = AdminService()