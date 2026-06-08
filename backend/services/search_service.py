from backend.models.job import Job
from backend.models.profile import WorkerProfile, Skill
from backend.models.user import User
from backend import db


def search_jobs(keyword=None, category=None, location=None):
    query = Job.query.filter(Job.status == 'open')
    if keyword:
        query = query.filter(Job.title.ilike(f'%{keyword}%') | Job.description.ilike(f'%{keyword}%'))
    if category:
        query = query.filter(Job.category.ilike(f'%{category}%'))
    if location:
        query = query.filter(Job.location.ilike(f'%{location}%'))
    return query.order_by(Job.created_at.desc()).all()


def search_workers(skill=None, location=None, category=None, min_rate=None, max_rate=None):
    query = WorkerProfile.query.join(WorkerProfile.user)
    if skill:
        query = query.join(WorkerProfile.skills).filter(Skill.name.ilike(f'%{skill}%'))
    if location:
        query = query.filter(WorkerProfile.service_area.ilike(f'%{location}%') | WorkerProfile.user.has(User.location.ilike(f'%{location}%')))
    if min_rate:
        query = query.filter(WorkerProfile.hourly_rate >= float(min_rate))
    if max_rate:
        query = query.filter(WorkerProfile.hourly_rate <= float(max_rate))
    return query.join(WorkerProfile.user).order_by(User.rating.desc()).all()
