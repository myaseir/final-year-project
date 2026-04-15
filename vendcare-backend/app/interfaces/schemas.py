from pydantic import BaseModel

class PaymentRequest(BaseModel):
    product_id: str
    price: int

class PaymentResponse(BaseModel):
    transaction_id: str
    checkout_url: str