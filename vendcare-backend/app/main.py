from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from app.infrastructure.websocket_manager import ws_manager
from app.interfaces.api import router as api_router # Import the routes

app = FastAPI(title="VendCare Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the routes we just wrote
app.include_router(api_router, prefix="/api")

@app.websocket("/ws/payment-status/{transaction_id}")
async def websocket_endpoint(websocket: WebSocket, transaction_id: str):
    await ws_manager.connect(websocket, transaction_id)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.disconnect(transaction_id)