import uuid
from app.infrastructure.stripe_client import stripe_infra
from app.infrastructure.websocket_manager import ws_manager

class PaymentUseCase:
    async def initiate_payment(self, product_id: str, price: int):
        # 1. Generate a unique internal ID
        transaction_id = f"txn_{uuid.uuid4().hex[:8]}"
        
        # 2. Ask Stripe for a URL, passing our ID in metadata
        checkout_url = stripe_infra.create_checkout_session(
            product_id, price, transaction_id
        )
        
        return {
            "transaction_id": transaction_id,
            "checkout_url": checkout_url
        }

    async def confirm_payment(self, transaction_id: str):
        # 3. This is called by the Webhook later
        # It tells the specific WebSocket to show the "Thank You" modal
        await ws_manager.send_payment_success(transaction_id)

payment_service = PaymentUseCase()