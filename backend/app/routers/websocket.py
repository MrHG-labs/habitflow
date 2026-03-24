from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlmodel import Session
from app.database import get_session
from app.services import auth_service
from app.utils.websocket import manager

router = APIRouter()

async def get_ws_user_id(websocket: WebSocket, token: str, session: Session) -> int | None:
    """Extracts and validates the basic user_id from token. Returns None if invalid."""
    if not token:
        return None
        
    try:
        payload = auth_service.decode_token(token)
        if payload is None or payload.get("type") != "access":
            return None
            
        user_id = payload.get("sub")
        if user_id is None:
            return None
            
        user = auth_service.get_user_by_id(session, user_id)
        if not user:
            return None
            
        return user_id
    except Exception:
        return None

@router.websocket("/ws/sync")
async def websocket_sync_endpoint(
    websocket: WebSocket,
    token: str = None,
    session: Session = Depends(get_session)
):
    """
    WebSocket endpoint for real-time synchronization.
    Requires an access token passed as a query string parameter "?token=XYZ"
    """
    user_id = await get_ws_user_id(websocket, token, session)
    
    if not user_id:
        await websocket.close(code=1008) # Policy Violation (invalid auth)
        return
        
    await manager.connect(websocket, user_id)
    
    try:
        # Keep connection open. Client doesn't need to send anything, just receive broadcasts.
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket, user_id)
