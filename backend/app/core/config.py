from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "FeynmanBot"
    app_env: str = "development"
    frontend_url: str = "http://localhost:5173"
    
    supabase_url: str
    supabase_service_role_key: str
    
    ai_provider: str = "gemini"
    gemini_api_key: str = ""
    openai_api_key: str = ""
    use_mock_db: bool = False

    class Config:
        env_file = ".env"

settings = Settings()
