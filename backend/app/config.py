import os
from dotenv import load_dotenv

# .env 파일 로드
load_dotenv()

class Config:
    # Flask 설정
    SECRET_KEY = os.getenv("SECRET_KEY", "default-secret-key")
    API_KEY = os.getenv("API_KEY", SECRET_KEY)

    # 데이터베이스 설정
    DB_USER = os.getenv("DB_USER")
    DB_PASSWORD = os.getenv("DB_PASSWORD")
    DB_HOST = os.getenv("DB_HOST", "localhost")
    DB_NAME = os.getenv("DB_NAME")
    SQLALCHEMY_DATABASE_URI = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Flask-Mail 설정
    MAIL_SERVER = os.getenv("MAIL_SERVER")
    MAIL_PORT = int(os.getenv("MAIL_PORT", 587))
    MAIL_USE_TLS = os.getenv("MAIL_USE_TLS", "true").lower() in ("true", "1", "yes")
    MAIL_USERNAME = os.getenv("MAIL_USERNAME")
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
    MAIL_DEFAULT_SENDER = os.getenv("MAIL_DEFAULT_SENDER")
    ALERT_RECIPIENT = os.getenv("ALERT_RECIPIENT")

    # IP 차단 설정
    BLOCK_THRESHOLD = int(os.getenv("BLOCK_THRESHOLD", 5))
    BLOCK_TIME_WINDOW_MINUTES = int(os.getenv("BLOCK_TIME_WINDOW_MINUTES", 5))
    BLOCK_DURATION_HOURS = int(os.getenv("BLOCK_DURATION_HOURS", 24))