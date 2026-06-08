from backend import db
from backend.models.base import BaseModel
from sqlalchemy.orm import relationship


class Report(BaseModel):
    __tablename__ = 'reports'

    reporter_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    target_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    reason = db.Column(db.String(240), nullable=False)
    details = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(24), default='open')

    reporter = relationship('User', foreign_keys=[reporter_id], back_populates='reports_made')
    target = relationship('User', foreign_keys=[target_id], back_populates='reports_received')

    def to_dict(self):
        data = super().to_dict()
        data['reporter'] = self.reporter.to_dict() if self.reporter else None
        data['target'] = self.target.to_dict() if self.target else None
        return data
