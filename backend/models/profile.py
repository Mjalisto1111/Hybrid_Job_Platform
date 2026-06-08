from backend import db
from .base import BaseModel
from sqlalchemy.orm import relationship

worker_skill = db.Table(
    'worker_skill',
    db.Column('worker_id', db.Integer, db.ForeignKey('worker_profiles.id'), primary_key=True),
    db.Column('skill_id', db.Integer, db.ForeignKey('skills.id'), primary_key=True),
)


class CustomerProfile(BaseModel):
    __tablename__ = 'customer_profiles'

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    company_name = db.Column(db.String(140), nullable=True)
    phone_number = db.Column(db.String(60), nullable=True)

    user = relationship('User', back_populates='customer_profile')


class WorkerProfile(BaseModel):
    __tablename__ = 'worker_profiles'

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    headline = db.Column(db.String(180), nullable=True)
    hourly_rate = db.Column(db.Numeric(10, 2), nullable=True)
    service_area = db.Column(db.String(160), nullable=True)
    availability = db.Column(db.String(120), nullable=True)
    experience_years = db.Column(db.Integer, default=0)
    portfolio_items = relationship('PortfolioItem', back_populates='worker', lazy='dynamic')
    certifications = relationship('Certification', back_populates='worker', lazy='dynamic')
    skills = relationship('Skill', secondary=worker_skill, back_populates='workers', lazy='dynamic')
    favorites = relationship('FavoriteWorker', back_populates='worker', lazy='dynamic')

    user = relationship('User', back_populates='worker_profile')


class EmployerProfile(BaseModel):
    __tablename__ = 'employer_profiles'

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    company_id = db.Column(db.Integer, db.ForeignKey('companies.id'), nullable=True)
    phone_number = db.Column(db.String(60), nullable=True)

    user = relationship('User', back_populates='employer_profile')
    company = relationship('Company', back_populates='employer_profile')


class Skill(BaseModel):
    __tablename__ = 'skills'

    name = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.Text, nullable=True)

    workers = relationship('WorkerProfile', secondary=worker_skill, back_populates='skills', lazy='dynamic')


class Certification(BaseModel):
    __tablename__ = 'certifications'

    worker_id = db.Column(db.Integer, db.ForeignKey('worker_profiles.id'), nullable=False)
    name = db.Column(db.String(180), nullable=False)
    issuer = db.Column(db.String(140), nullable=True)
    certificate_url = db.Column(db.String(255), nullable=True)

    worker = relationship('WorkerProfile', back_populates='certifications')


class PortfolioItem(BaseModel):
    __tablename__ = 'portfolio_items'

    worker_id = db.Column(db.Integer, db.ForeignKey('worker_profiles.id'), nullable=False)
    title = db.Column(db.String(180), nullable=False)
    description = db.Column(db.Text, nullable=True)
    media_url = db.Column(db.String(255), nullable=True)

    worker = relationship('WorkerProfile', back_populates='portfolio_items')


class FavoriteWorker(BaseModel):
    __tablename__ = 'favorite_workers'

    customer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    worker_id = db.Column(db.Integer, db.ForeignKey('worker_profiles.id'), nullable=False)
    notes = db.Column(db.String(255), nullable=True)

    worker = relationship('WorkerProfile', back_populates='favorites')
    customer = relationship('User', back_populates='favorites')
