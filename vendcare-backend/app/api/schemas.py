from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from typing import Union
# --- USER APP SCHEMAS ---
class UserRegisterRequest(BaseModel):
    cnic: str = Field(..., example="42101-1234567-1")
    email: EmailStr = Field(..., example="user@example.com")
    pin: str = Field(..., min_length=4, max_length=4, example="1234")
    full_name: str = Field(..., example="Hamza Ahmed")

class LoginRequest(BaseModel):
    identifier: str
    pin: str = Field(..., example="1234")

class TopUpRequestSchema(BaseModel):
    cnic: str = Field(..., example="42101-1234567-1")
    amount: int = Field(..., example=500)
    reference_id: str = Field(..., example="TXN-998877")

# --- MACHINE SCHEMAS ---
class DispenseRequest(BaseModel):
    """Updated to include precision volume for dispensing logic."""
    identifier: str = Field(..., example="user@example.com or 42101-1234567-1")
    pin: str = Field(..., min_length=4, max_length=4, example="1234")
    product_name: str = Field(..., example="Floral Breeze") 
    selected_amount: int = Field(..., ge=1, le=1000, example=50) # Range adjusted for small dosages
    volume: float = Field(..., example=1.5) # FIX: Added to resolve AttributeError
    machine_id: str = Field(..., example="VEND-UNIT-01")

# NEW: QR Payment Request Schema for Mobile Integration
class PaymentRequest(BaseModel):
    """Updated to include volume for QR-based price calculation."""
    product_id: str = Field(..., example="p1")
    price: int = Field(..., example=120)
    volume: float = Field(..., example=2.0) # FIX: Added to resolve AttributeError

# --- Mobile Confirmation Schema ---
class ConfirmPaymentRequest(BaseModel):
    """
    This is the specific model the mobile-vend page sends to the backend.
    """
    identifier: str = Field(..., example="user@example.com")
    pin: str = Field(..., example="1234")

# --- ADMIN SCHEMAS ---
class AdminActionSchema(BaseModel):
    cnic: str = Field(..., example="42101-1234567-1")
    reference_id: str = Field(..., example="TXN-998877")
    
class RefillRequest(BaseModel):
    target: Union[int, str]