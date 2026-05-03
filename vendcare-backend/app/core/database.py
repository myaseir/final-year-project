import os
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.core.models import User, Tank 
from dotenv import load_dotenv

load_dotenv()

# Global database instance to be used by routers
db = None

async def init_db():
    global db
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
        
        # Set the global db instance for use in machine_routes
        db = current_db
        
        # Register BOTH models to avoid Beanie initialization errors
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