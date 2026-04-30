from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

# Update these imports to match your new modular files
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

# CORS Setup for Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"], 
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
    return {"status": "Online", "message": "VendCare Multi-Portal API is running"}