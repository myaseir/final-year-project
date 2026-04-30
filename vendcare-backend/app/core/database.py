import os
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.core.models import User
from dotenv import load_dotenv

load_dotenv()

async def init_db():
    mongo_uri = os.getenv("MONGO_URI")
    
    # Initialize the Motor Client
    client = AsyncIOMotorClient(
        mongo_uri,
        tls=True,
        tlsAllowInvalidCertificates=True
    )
    
    try:
        # Explicitly name your database here
        # This solves the "No default database name" error
        db = client.vendcare_db 
        
        await init_beanie(
            database=db, 
            document_models=[User]
        )
        print("✅ MongoDB Connected: vendcare_db is now active.")
    except Exception as e:
        print(f"❌ Database Error: {e}")
        raise e