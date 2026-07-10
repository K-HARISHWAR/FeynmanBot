from supabase import create_client, Client
from app.core.config import settings

def get_supabase_client() -> Client | None:
    if settings.use_mock_db:
        return None
        
    url = settings.supabase_url
    key = settings.supabase_secret_key if settings.supabase_secret_key else settings.supabase_service_role_key
    
    if not url or not key:
        raise ValueError("Supabase configuration is missing. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, or use USE_MOCK_DB=true.")
        
    try:
        return create_client(url, key)
    except Exception as e:
        raise ValueError(f"Failed to initialize Supabase client: {e}")

supabase = get_supabase_client()
