from backend import db
from .base import BaseModel
from sqlalchemy.orm import relationship


class Review(BaseModel):
    __tablename__ = 'reviews'

    job_id = db.Column(db.Integer, db.ForeignKey('jobs.id'), nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    target_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.Text, nullable=True)

    job = relationship('Job', back_populates='reviews')
    author = relationship('User', foreign_keys=[author_id], back_populates='reviews')
    target = relationship('User', foreign_keys=[target_id])


class Rating(BaseModel):
    __tablename__ = 'ratings'

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    source_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    value = db.Column(db.Integer, nullable=False)
    review_id = db.Column(db.Integer, db.ForeignKey('reviews.id'), nullable=True)
