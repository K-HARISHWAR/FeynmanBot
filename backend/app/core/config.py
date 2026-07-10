from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "FeynmanBot"
    app_env: str = "development"
    frontend_url: str = "http://localhost:5173"
    ai_provider: str = "gemini"
    gemini_model: str = "gemini-2.5-flash"
    use_mock_db: bool = True
    gemini_api_key: str = ""
    openai_api_key: str = ""
    supabase_url: str = ""
    supabase_service_role_key: str = ""
    supabase_secret_key: str = ""

    class Config:
        env_file = ".env"

settings = Settings()
