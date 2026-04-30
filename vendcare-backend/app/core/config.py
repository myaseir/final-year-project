import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    # --- Project Metadata ---
    PROJECT_NAME: str = "VendCare Professional IoT System"
    VERSION: str = "2.0.0"
    
    # --- Security & Auth ---
    # These should be moved to your .env file for defense
    ADMIN_USERNAME: str = os.getenv("ADMIN_USERNAME", "admin")
    ADMIN_PASSWORD: str = os.getenv("ADMIN_PASSWORD", "secret123")
    MACHINE_SECRET: str = os.getenv("MACHINE_SECRET", "vendcare_iot_2026")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "highly_secret_vending_key_change_me")
    ALGORITHM: str = "HS256"
    
    # --- Database (MongoDB Atlas) ---
    # Used by lifespan in main.py to init_db()
    MONGODB_URL: str = os.getenv("MONGODB_URL", "mongodb+srv://...")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME", "vendcare_db")

    # --- IoT & Mobile Integration ---
    # Used for generating the QR Code links in machine_routes.py
    # Change this to your deployed Vercel URL when going live
    MOBILE_APP_URL: str = os.getenv("MOBILE_APP_URL", "http://localhost:3000")
    
    # --- Vending Logic ---
    # PKR Range for the frontend scroll-bar logic
    MIN_DISPENSE_PKR: int = 20
    MAX_DISPENSE_PKR: int = 70

    class Config:
        case_sensitive = True
        env_file = ".env"

# Instantiate for global use
settings = Settings()