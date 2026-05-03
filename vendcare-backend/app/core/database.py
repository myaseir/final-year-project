import os
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.core.models import User, Tank 
from dotenv import load_dotenv

load_dotenv()

# We keep this internal to the module
_db = None

async def init_db():
    """Initializes the database connection and registers Beanie models."""
    global _db
    mongo_uri = os.getenv("MONGO_URI")
    
    # Initialize the Motor Client with standard IoT security flags
    client = AsyncIOMotorClient(
        mongo_uri,
        tls=True,
        tlsAllowInvalidCertificates=True
    )
    
    try:
        # Targeting the specific vendcare database
        current_db = client.vendcare_db 
        
        # Set the internal global instance
        _db = current_db
        
        # Register models to avoid Beanie initialization errors
        await init_beanie(
            database=current_db, 
            document_models=[User, Tank] 
        )
        
        # Create an index for the polling queue to ensure fast lookups
        await current_db.dispense_queue.create_index([("machine_id", 1), ("status", 1)])
        
        print("✅ MongoDB Connected: vendcare_db is active and models are registered.")
        
    except Exception as e:
        print(f"❌ Database Error: {e}")
        raise e

def get_db():
    """
    Returns the initialized database instance. 
    Use this inside your routes to avoid NoneType errors.
    """
    return _db