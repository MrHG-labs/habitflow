import json
from typing import Dict, List
from fastapi import WebSocket

class ConnectionManager:
    """Manages active WebSocket connections per user."""
    def __init__(self):
        # Maps user_id to a list of active WebSocket connections
        self.active_connections: Dict[int, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, user_id: int):
        await websocket.accept()
        if user_id not in self.active_connections:
            self.active_connections[user_id] = []
        self.active_connections[user_id].append(websocket)

    def disconnect(self, websocket: WebSocket, user_id: int):
        if user_id in self.active_connections:
            if websocket in self.active_connections[user_id]:
                self.active_connections[user_id].remove(websocket)
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]

    async def broadcast_to_user(self, user_id: int, message: dict):
        """Send a JSON message to all active connections for a specific user."""
        if user_id in self.active_connections:
            # Create a copy of the list to avoid issues if a connection closes during broadcast
            connections = list(self.active_connections[user_id])
            for connection in connections:
                try:
                    await connection.send_text(json.dumps(message))
                except Exception:
                    # If sending fails, safely disconnect
                    self.disconnect(connection, user_id)

manager = ConnectionManager()
