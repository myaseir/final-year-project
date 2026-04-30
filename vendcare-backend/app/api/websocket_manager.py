from fastapi import WebSocket
from typing import Dict

class ConnectionManager:
    def __init__(self):
        # Maps transaction_id to the active WebSocket connection
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, transaction_id: str):
        await websocket.accept()
        self.active_connections[transaction_id] = websocket

    def disconnect(self, transaction_id: str):
        if transaction_id in self.active_connections:
            del self.active_connections[transaction_id]

    async def send_payment_success(self, transaction_id: str):
        """Sends the PAID status to the specific frontend screen"""
        if transaction_id in self.active_connections:
            websocket = self.active_connections[transaction_id]
            await websocket.send_json({"status": "PAID"})
            # Close the connection after successful payment
            await websocket.close()
            self.disconnect(transaction_id)

# Global instance to be used across the app
ws_manager = ConnectionManager()