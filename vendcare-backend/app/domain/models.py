from pydantic import BaseModel
from typing import Optional

class Transaction(BaseModel):
    id: str
    product_id: str
    amount: int
    status: str  # "pending", "paid", "failed"