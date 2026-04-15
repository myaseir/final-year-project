import stripe
import os
from dotenv import load_dotenv

load_dotenv()

# Securely set the API key
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

class StripeInfrastructure:
    def create_checkout_session(self, product_id: str, amount: int, transaction_id: str):
        # We use stripe.checkout.Session.create (Note the Capital 'S')
        # This is the most compatible way across library versions
        session = stripe.checkout.Session.create(
            payment_method_types=['card'], 
            line_items=[{
                'price_data': {
                    'currency': 'inr',
                    'product_data': {'name': f"Product: {product_id}"},
                    'unit_amount': int(amount * 100), # Ensure it's an integer
                },
                'quantity': 1,
            }],
            mode='payment',
            # For testing, you can use these example URLs
            success_url="http://localhost:3000/success", 
            cancel_url="http://localhost:3000/cancel",
            metadata={
                "transaction_id": transaction_id
            }
        )
        return session.url

stripe_infra = StripeInfrastructure()