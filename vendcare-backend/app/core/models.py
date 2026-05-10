from pydantic import BaseModel, EmailStr, Field
from beanie import Document
from typing import List, Optional
from datetime import datetime

# --- SUB-MODELS (Embedded in User Document) ---

class Purchase(BaseModel):
    """
    Records a single transaction. 
    Volume is critical for tracking fluid consumption in the Admin Panel.
    """
    product_name: str
    amount: int  
    volume: float = 0.0  # Captures exact ml dispensed from the hardware
    date: str            # Format: "YYYY-MM-DD HH:MM"
    machine_id: str
    type: str = "debit"  # "debit" for purchases, "credit" for top-ups[cite: 7]

class TopUpRequest(BaseModel):
    """
    Initial request made by a user for a wallet recharge.
    Awaits admin approval in the 'pending-topups' route.
    """
    reference_id: str
    amount: int
    status: str = "PENDING"  # PENDING, APPROVED, REJECTED[cite: 5]
    date: str

class RefillLog(Document):
    """
    Independent collection used for inventory auditing.
    Tracks when an admin manually resets a tank to max capacity[cite: 5, 6, 7].
    """
    product_name: str
    volume_added_ml: float
    date: str

    class Settings:
        name = "refill_logs" # Stored in MongoDB for loss prevention audits[cite: 6]

# --- MAIN DATABASE DOCUMENTS ---

class Tank(Document):
    """
    Represents one of the 9 physical bottles in the machine.
    Linked to hardware via tank_index[cite: 5, 8].
    """
    tank_index: int       # 1 through 9 (Hardware Slot ID)[cite: 5, 8]
    product_name: str     # Matches the names in MachineService.PRODUCT_SLOTS[cite: 8]
    max_capacity: float   # Usually 500.0[cite: 5]
    current_level: float  # Real-time fluid level shown on Admin Panel[cite: 5, 7]
    hex_color: str 
    
    ms_per_ml: int = 1500  # Category-based: Pink, Blue, or Purple[cite: 7]

    class Settings:
        name = "tanks"

class User(Document):
    """
    The primary user account profile for the VendCare app.
    """
    cnic: str = Field(unique=True)
    email: EmailStr = Field(unique=True)
    pin: str = Field(min_length=4, max_length=4)
    full_name: str
    balance: int = 0
    history: List[Purchase] = []
    pending_topups: List[TopUpRequest] = []

    class Settings:
        name = "users" # The collection name in MongoDB Atlas[cite: 5]