from backend import db
from .base import BaseModel
from sqlalchemy.orm import relationship


class Notification(BaseModel):
    __tablename__ = 'notifications'

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(180), nullable=False)
    message = db.Column(db.Text, nullable=True)
    category = db.Column(db.String(80), nullable=True)
    is_read = db.Column(db.Boolean, default=False)
    payload = db.Column(db.JSON, nullable=True)

    user = relationship('User', back_populates='notifications')
