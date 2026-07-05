from supabase import create_client, Client
from app.core.config import settings

def get_supabase_client() -> Client | None:
    if settings.use_mock_db:
        return None
        
    url = settings.supabase_url
    key = settings.supabase_service_role_key
    try:
        return create_client(url, key)
    except Exception as e:
        print(f"Failed to initialize Supabase client: {e}")
        return None

supabase = get_supabase_client()
