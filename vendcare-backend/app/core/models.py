from pydantic import BaseModel, EmailStr, Field
from beanie import Document
from typing import List, Optional
from datetime import datetime

# --- SUB-MODELS (Embedded in User Document) ---

class Purchase(BaseModel):
    product_name: str
    amount: int  # This stores the variable amount from the scroll bar
    date: str
    machine_id: str

class TopUpRequest(BaseModel):
    reference_id: str
    amount: int
    status: str = "PENDING"  # PENDING, APPROVED, REJECTED
    date: str

# --- MAIN DATABASE DOCUMENT ---

class User(Document):
    cnic: str = Field(unique=True)
    email: EmailStr = Field(unique=True)
    pin: str = Field(min_length=4, max_length=4)
    full_name: str
    balance: int = 0
    history: List[Purchase] = []
    pending_topups: List[TopUpRequest] = []

    class Settings:
        name = "users" # The collection name in MongoDB Atlas