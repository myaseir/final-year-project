from fastapi import APIRouter, HTTPException
from app.api.schemas import AdminActionSchema
from app.services.admin_service import admin_service

router = APIRouter()

@router.get("/pending-topups")
async def get_all_pending():
    # Logic to fetch all users who have pending_topups
    return await admin_service.get_all_pending_requests()

@router.post("/approve-topup")
async def approve(data: AdminActionSchema):
    result = await admin_service.approve_topup(data.cnic, data.reference_id)
    if not result["success"]:
        raise HTTPException(status_code=400, detail="Approval failed")
    return result