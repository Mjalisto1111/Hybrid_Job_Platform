from backend import db
from .base import BaseModel
from sqlalchemy.orm import relationship


class Company(BaseModel):
    __tablename__ = 'companies'

    name = db.Column(db.String(180), nullable=False)
    website = db.Column(db.String(255), nullable=True)
    address = db.Column(db.String(255), nullable=True)
    description = db.Column(db.Text, nullable=True)
    logo_url = db.Column(db.String(255), nullable=True)

    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    owner = relationship('User', back_populates='company')
    employer_profile = relationship('EmployerProfile', back_populates='company', uselist=False)
    jobs = relationship('Job', back_populates='company', lazy='dynamic')
