from fastapi import APIRouter, HTTPException
from app.services.user_service import user_service
from app.api.schemas import UserRegisterRequest, TopUpRequestSchema, LoginRequest

router = APIRouter()

@router.post("/register")
async def register(user_data: UserRegisterRequest): # Use the Schema here
    # .model_dump() converts the Pydantic object back to a dict for the service
    result = await user_service.register_user(user_data.model_dump())
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["message"])
    return result

@router.post("/wallet/request-topup")
async def request_topup(data: TopUpRequestSchema):
    return await user_service.request_topup(data.cnic, data.amount, data.reference_id)

@router.post("/login")
async def login(credentials: LoginRequest):
    result = await user_service.login_user(credentials.cnic, credentials.pin)
    
    if not result["success"]:
        # Use 401 Unauthorized for failed logins
        raise HTTPException(status_code=401, detail=result["message"])
        
    return result

