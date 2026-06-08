from datetime import datetime
from flask import current_app
from backend.models.notification import Notification
from backend import db


def send_email(recipient: str, subject: str, body: str) -> None:
    current_app.logger.info('Sending email to %s: %s', recipient, subject)
    return None


def create_notification(user_id: int, title: str, message: str, category: str = 'general', payload=None):
    notification = Notification(
        user_id=user_id,
        title=title,
        message=message,
        category=category,
        payload=payload or {},
    )
    db.session.add(notification)
    db.session.commit()
    return notification


def serialize_model(instance):
    return instance.to_dict()
