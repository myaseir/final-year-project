from pydantic import BaseModel, EmailStr, Field
from typing import Optional

# --- USER APP SCHEMAS ---
class UserRegisterRequest(BaseModel):
    cnic: str = Field(..., example="42101-1234567-1")
    email: EmailStr = Field(..., example="user@example.com")
    pin: str = Field(..., min_length=4, max_length=4, example="1234")
    full_name: str = Field(..., example="Hamza Ahmed")

class LoginRequest(BaseModel):
    cnic: str = Field(..., example="42101-1234567-1")
    pin: str = Field(..., example="1234")

class TopUpRequestSchema(BaseModel):
    cnic: str = Field(..., example="42101-1234567-1")
    amount: int = Field(..., example=500)
    reference_id: str = Field(..., example="TXN-998877")

# --- MACHINE SCHEMAS ---
class DispenseRequest(BaseModel):
    cnic: str = Field(..., example="42101-1234567-1")
    pin: str = Field(..., min_length=4, max_length=4, example="1234")
    product_name: str = Field(..., example="Perfume-A") 
    selected_amount: int = Field(..., ge=20, le=1000, example=45) 
    machine_id: str = Field(..., example="VEND-UNIT-01")

# NEW: QR Payment Request Schema for Mobile Integration
class PaymentRequest(BaseModel):
    product_id: str = Field(..., example="p1")
    price: int = Field(..., example=120)

# --- ADMIN SCHEMAS ---
class AdminActionSchema(BaseModel):
    cnic: str = Field(..., example="42101-1234567-1")
    reference_id: str = Field(..., example="TXN-998877")