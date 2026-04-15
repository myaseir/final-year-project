import stripe
import os
from fastapi import APIRouter, Request, Header, HTTPException
from app.interfaces.schemas import PaymentRequest, PaymentResponse
from app.use_cases.payment_service import payment_service

router = APIRouter()

@router.post("/create-payment", response_model=PaymentResponse)
async def create_payment(payload: PaymentRequest):
    """
    Called by Next.js when the user clicks 'SELECT'.
    Returns the transaction_id and the URL for the QR code.
    """
    result = await payment_service.initiate_payment(
        product_id=payload.product_id, 
        price=payload.price
    )
    return result

@router.post("/webhook")
async def stripe_webhook(request: Request, stripe_signature: str = Header(None)):
    """
    Called by Stripe after the user pays on their phone.
    """
    payload = await request.body()
    webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET")

    try:
        # Verify that the request actually came from Stripe
        event = stripe.Webhook.construct_event(
            payload, stripe_signature, webhook_secret
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Handle the checkout.session.completed event
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        
        # Grab the transaction_id we hid in the metadata earlier
        transaction_id = session.get("metadata", {}).get("transaction_id")
        
        if transaction_id:
            # Trigger the WebSocket to show the "Thank You" modal on the screen
            await payment_service.confirm_payment(transaction_id)
            print(f"✅ Payment confirmed for {transaction_id}")

    return {"status": "success"}