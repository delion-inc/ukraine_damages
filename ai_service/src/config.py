from pydantic_settings import BaseSettings, SettingsConfigDict
import logging
import os

os.makedirs('logs', exist_ok=True)
logging.basicConfig(filename='logs/app.log', level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')


class Settings(BaseSettings):
    open_ai_api_key: str
    gpt_model: str

    model_config = SettingsConfigDict(env_file=".env")


settings = Settings()
