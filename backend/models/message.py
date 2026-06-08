from backend import db
from .base import BaseModel
from sqlalchemy.orm import relationship


class Conversation(BaseModel):
    __tablename__ = 'conversations'

    title = db.Column(db.String(180), nullable=True)
    participants = relationship('Message', back_populates='conversation', lazy='dynamic')


class Message(BaseModel):
    __tablename__ = 'messages'

    conversation_id = db.Column(db.Integer, db.ForeignKey('conversations.id'), nullable=False)
    sender_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    is_read = db.Column(db.Boolean, default=False)
    attachment_url = db.Column(db.String(255), nullable=True)

    conversation = relationship('Conversation', back_populates='participants')
    sender = relationship('User', foreign_keys=[sender_id], back_populates='messages_sent')
    receiver = relationship('User', foreign_keys=[receiver_id], back_populates='messages_received')
