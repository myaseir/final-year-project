from fastapi import APIRouter, HTTPException
from app.api.schemas import UserRegisterRequest, LoginRequest, TopUpRequestSchema
from app.services.user_service import user_service

router = APIRouter()

@router.post("/register")
async def register(data: UserRegisterRequest):
    result = await user_service.register_user(data.model_dump())
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["message"])
    return result

@router.post("/login")
async def login(data: LoginRequest):
    result = await user_service.login_user(data.cnic, data.pin)
    if not result["success"]:
        raise HTTPException(status_code=401, detail=result["message"])
    return result

@router.get("/profile/{cnic}")
async def get_profile(cnic: str):
    profile = await user_service.get_profile(cnic)
    if not profile:
        raise HTTPException(status_code=404, detail="User not found")
    return profile

@router.post("/wallet/request-topup")
async def request_topup(data: TopUpRequestSchema):
    return await user_service.request_topup(data.cnic, data.amount, data.reference_id)