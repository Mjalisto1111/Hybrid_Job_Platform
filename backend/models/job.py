from backend import db
from .base import BaseModel
from sqlalchemy.orm import relationship


class Job(BaseModel):
    __tablename__ = 'jobs'

    title = db.Column(db.String(180), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(120), nullable=False)
    location = db.Column(db.String(180), nullable=True)
    rate = db.Column(db.Numeric(10, 2), nullable=True)
    currency = db.Column(db.String(20), default='ZAR')
    status = db.Column(db.String(60), default='open')
    service_radius = db.Column(db.Integer, nullable=True)
    posted_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    company_id = db.Column(db.Integer, db.ForeignKey('companies.id'), nullable=True)

    employer = relationship('User', back_populates='jobs')
    company = relationship('Company', back_populates='jobs')
    applications = relationship('Application', back_populates='job', lazy='dynamic')
    bookings = relationship('Booking', back_populates='job', lazy='dynamic')
    reviews = relationship('Review', back_populates='job', lazy='dynamic')


class Application(BaseModel):
    __tablename__ = 'applications'

    job_id = db.Column(db.Integer, db.ForeignKey('jobs.id'), nullable=False)
    candidate_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    cover_letter = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(60), default='pending')

    job = relationship('Job', back_populates='applications')
    candidate = relationship('User', back_populates='applications')


class Booking(BaseModel):
    __tablename__ = 'bookings'

    job_id = db.Column(db.Integer, db.ForeignKey('jobs.id'), nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    worker_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    status = db.Column(db.String(60), default='requested')
    scheduled_date = db.Column(db.String(100), nullable=True)
    total_amount = db.Column(db.Numeric(10, 2), nullable=True)

    job = relationship('Job', back_populates='bookings')
    customer = relationship('User', foreign_keys=[customer_id])
    worker = relationship('User', foreign_keys=[worker_id], back_populates='bookings')
