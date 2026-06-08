import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / '.env')

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'change-me-secret-key-should-be-updated')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'change-me-jwt-secret-key-should-be-updated-1234')
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'SQLALCHEMY_DATABASE_URI',
        f'sqlite:///{BASE_DIR / "skillconnect.db"}',
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    CORS_HEADERS = 'Content-Type'
    CLOUDINARY_URL = os.getenv('CLOUDINARY_URL', '')
    FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:5173')
    SOCKETIO_MESSAGE_QUEUE = os.getenv('SOCKETIO_MESSAGE_QUEUE', None)
    JWT_ACCESS_TOKEN_EXPIRES = 3600
    JWT_REFRESH_TOKEN_EXPIRES = 86400
