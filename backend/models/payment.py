from backend import db
from .base import BaseModel
from sqlalchemy.orm import relationship


class Payment(BaseModel):
    __tablename__ = 'payments'

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    booking_id = db.Column(db.Integer, db.ForeignKey('bookings.id'), nullable=True)
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    currency = db.Column(db.String(10), default='ZAR')
    status = db.Column(db.String(80), default='pending')
    transaction_reference = db.Column(db.String(180), nullable=True)
    escrow_reference = db.Column(db.String(180), nullable=True)

    user = relationship('User', back_populates='payments')
