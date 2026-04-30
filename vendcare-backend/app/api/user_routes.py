from fastapi import APIRouter, HTTPException, status
from app.api.schemas import UserRegisterRequest, LoginRequest, TopUpRequestSchema
from app.services.user_service import user_service

router = APIRouter()

@router.post("/register")
async def register(data: UserRegisterRequest):
    # Dumps model data to dictionary for service layer
    result = await user_service.register_user(data.model_dump())
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["message"])
    return result

@router.post("/login")
async def login(data: LoginRequest):
    # Uses 'identifier' to allow either Email or CNIC login
    result = await user_service.login_user(data.identifier, data.pin)
    if not result["success"]:
        # Returns 401 Unauthorized for invalid credentials
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail=result["message"]
        )
    return result

@router.get("/profile/{identifier}")
async def get_profile(identifier: str):
    # Updated to find profile by either CNIC or Email
    profile = await user_service.get_profile(identifier)
    if not profile:
        raise HTTPException(status_code=404, detail="User not found")
    return profile

@router.post("/wallet/request-topup")
async def request_topup(data: TopUpRequestSchema):
    # Handles balance top-up requests
    return await user_service.request_topup(data.cnic, data.amount, data.reference_id)