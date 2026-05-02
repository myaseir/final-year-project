import os
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.core.models import User, Tank 
from dotenv import load_dotenv

load_dotenv()

async def init_db():
    mongo_uri = os.getenv("MONGO_URI")
    
    # Initialize the Motor Client with standard IoT security flags
    client = AsyncIOMotorClient(
        mongo_uri,
        tls=True,
        tlsAllowInvalidCertificates=True
    )
    
    try:
        # Targeting the specific vendcare database
        db = client.vendcare_db 
        
        # Register BOTH models to avoid Beanie initialization errors
        await init_beanie(
            database=db, 
            document_models=[User, Tank] 
        )
        
        print("✅ MongoDB Connected: vendcare_db is active and models are registered.")
        
    except Exception as e:
        print(f"❌ Database Error: {e}")
        raise e