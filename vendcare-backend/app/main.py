import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

# Modular imports
from app.api.user_routes import router as user_router
from app.api.admin_routes import router as admin_router
from app.api.machine_routes import router as machine_router
from app.core.database import init_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    # This runs when the server starts
    await init_db()
    yield
    # This runs when the server stops

app = FastAPI(
    title="VendCare Professional API",
    description="Backend for Vending Machine, User Wallet, and Admin Dashboard",
    version="2.0.0",
    lifespan=lifespan
)

# 1. Define Allowed Origins
# We include your local environments and both Vercel production links
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://final-year-project-iota-six.vercel.app",
    "https://final-year-project-wgam.vercel.app",
]

# 2. Dynamic Origins (Optional but recommended for Glacia Labs projects)
# This allows you to add more URLs via the Railway/hosting dashboard without redeploying code
env_origins = os.getenv("ALLOWED_ORIGINS")
if env_origins:
    origins.extend(env_origins.split(","))

# 3. CORS Middleware Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register the modular routers
app.include_router(user_router, prefix="/api/user", tags=["User App"])
app.include_router(admin_router, prefix="/api/admin", tags=["Admin Portal"])
app.include_router(machine_router, prefix="/api/machine", tags=["Vending Machine"])

@app.get("/")
async def root():
    return {
        "status": "Online", 
        "message": "VendCare Multi-Portal API is running",
        "branding": "Glacia Labs"
    }