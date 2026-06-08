from werkzeug.security import generate_password_hash, check_password_hash
from backend import db
from .base import BaseModel
from .review import Review
from sqlalchemy.orm import relationship


class User(BaseModel):
    __tablename__ = 'users'

    email = db.Column(db.String(140), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(120), nullable=False)
    role = db.Column(db.String(30), nullable=False)
    is_verified = db.Column(db.Boolean, default=False)
    location = db.Column(db.String(140), nullable=True)
    bio = db.Column(db.Text, nullable=True)
    avatar_url = db.Column(db.String(255), nullable=True)
    rating = db.Column(db.Float, default=0.0)
    reputation = db.Column(db.Integer, default=0)
    is_active = db.Column(db.Boolean, default=True)

    customer_profile = relationship('CustomerProfile', back_populates='user', uselist=False)
    worker_profile = relationship('WorkerProfile', back_populates='user', uselist=False)
    employer_profile = relationship('EmployerProfile', back_populates='user', uselist=False)
    company = relationship('Company', back_populates='owner', uselist=False)
    jobs = relationship('Job', back_populates='employer', lazy='dynamic')
    favorites = relationship('FavoriteWorker', back_populates='customer', lazy='dynamic')
    applications = relationship('Application', back_populates='candidate', lazy='dynamic')
    bookings = relationship('Booking', back_populates='worker', foreign_keys='Booking.worker_id', lazy='dynamic')
    messages_sent = relationship('Message', foreign_keys='Message.sender_id', back_populates='sender', lazy='dynamic')
    messages_received = relationship('Message', foreign_keys='Message.receiver_id', back_populates='receiver', lazy='dynamic')
    reviews = relationship('Review', foreign_keys=[Review.author_id], back_populates='author', lazy='dynamic')
    notifications = relationship('Notification', back_populates='user', lazy='dynamic')
    payments = relationship('Payment', back_populates='user', lazy='dynamic')

    def set_password(self, password: str):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        data = super().to_dict()
        data.pop('password_hash', None)
        return data


from .report import Report

User.reports_made = relationship(
    'Report',
    primaryjoin='User.id == foreign(Report.reporter_id)',
    back_populates='reporter',
    lazy='dynamic',
)

User.reports_received = relationship(
    'Report',
    primaryjoin='User.id == foreign(Report.target_id)',
    back_populates='target',
    lazy='dynamic',
)
