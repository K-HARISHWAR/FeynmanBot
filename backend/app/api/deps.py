from fastapi import Depends, HTTPException, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.services.supabase_service import supabase
from app.core.config import settings

security = HTTPBearer()

class CurrentUser:
    def __init__(self, id: str, email: str):
        self.id = id
        self.email = email

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> CurrentUser:
    if settings.use_mock_db:
        # In mock db mode, return a dummy user.
        return CurrentUser(id="demo-user", email="demo@example.com")
        
    token = credentials.credentials
    try:
        # Use Supabase Python client to verify token
        # auth.get_user(token) queries the Supabase auth server to validate the JWT
        res = supabase.auth.get_user(token)
        if not res or not res.user:
            raise HTTPException(status_code=401, detail="Authentication required.")
        return CurrentUser(id=res.user.id, email=res.user.email)
    except Exception as e:
        raise HTTPException(status_code=401, detail="Authentication failed or token invalid.")
