from fastapi import APIRouter, HTTPException
from app.api.schemas import AdminActionSchema
from app.services.admin_service import admin_service

router = APIRouter()

@router.get("/pending-topups")
async def get_all_pending():
    """
    Fetches all user top-up requests that are currently awaiting 
    administrative approval.
    """
    # Returns a list of requests sorted by date (newest first)
    return await admin_service.get_all_pending_requests()

@router.post("/approve-topup")
async def approve(data: AdminActionSchema):
    """
    Processes the approval of a specific top-up request.
    Updates the user's wallet balance and adds a 'credit' entry to history.
    """
    result = await admin_service.approve_topup(data.cnic, data.reference_id)
    
    if not result["success"]:
        # Provides specific feedback (e.g., "User not found" or "Reference ID not found")
        raise HTTPException(
            status_code=400, 
            detail=result.get("message", "Approval failed")
        )
    
    # Returns {"success": True, "new_balance": ...}
    return result

@router.get("/analytics")
async def get_analytics():
    """
    Returns aggregated data for sales graphs, profit tracking, 
    and volume/concentration analysis for the Admin Dashboard.
    """
    # Hits the updated AdminService logic for volume-based profit and trends
    return await admin_service.get_dashboard_analytics()