import cloudinary.uploader
from backend.config import Config


def upload_asset(file_stream, filename: str) -> str:
    if not Config.CLOUDINARY_URL:
        return ''
    response = cloudinary.uploader.upload(file_stream, public_id=filename, overwrite=True)
    return response.get('secure_url', '')
