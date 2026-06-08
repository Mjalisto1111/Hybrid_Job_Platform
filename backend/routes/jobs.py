from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend import db
from backend.models.job import Job, Application, Booking
from backend.models.user import User
from backend.services.search_service import search_jobs
from backend.utils.decorators import role_required

jobs_bp = Blueprint('jobs', __name__)

CATEGORY_OPTIONS = [
    'Plumbing',
    'Electrical',
    'Carpentry',
    'Cleaning',
    'Tutoring',
    'Software Development',
    'Graphic Design',
    'Delivery Services',
    'Construction',
    'Gardening',
]


@jobs_bp.route('/', methods=['GET'])
def list_jobs():
    args = request.args
    keyword = args.get('keyword')
    category = args.get('category')
    location = args.get('location')
    jobs = search_jobs(keyword, category, location)
    return jsonify({'jobs': [job.to_dict() for job in jobs]})


@jobs_bp.route('/', methods=['POST'])
@jwt_required()
@role_required('employer')
def create_job():
    payload = request.get_json() or {}
    user = User.query.get(int(get_jwt_identity()))
    job = Job(
        title=payload.get('title', ''),
        description=payload.get('description', ''),
        category=payload.get('category', 'General'),
        location=payload.get('location', user.location),
        rate=payload.get('rate', 0),
        currency=payload.get('currency', 'ZAR'),
        service_radius=payload.get('service_radius', 20),
        posted_by=user.id,
        company_id=payload.get('company_id'),
    )
    db.session.add(job)
    db.session.commit()
    return jsonify({'job': job.to_dict()}), 201


@jobs_bp.route('/<int:job_id>', methods=['GET'])
def job_detail(job_id):
    job = Job.query.get_or_404(job_id)
    return jsonify({'job': job.to_dict()})


@jobs_bp.route('/<int:job_id>/apply', methods=['POST'])
@jwt_required()
@role_required('worker')
def apply_job(job_id):
    payload = request.get_json() or {}
    user = User.query.get(int(get_jwt_identity()))
    job = Job.query.get_or_404(job_id)
    application = Application(job_id=job.id, candidate_id=user.id, cover_letter=payload.get('cover_letter', ''))
    db.session.add(application)
    db.session.commit()
    return jsonify({'application': application.to_dict()}), 201


@jobs_bp.route('/<int:job_id>/book', methods=['POST'])
@jwt_required()
@role_required('customer')
def book_job(job_id):
    payload = request.get_json() or {}
    user = User.query.get(int(get_jwt_identity()))
    job = Job.query.get_or_404(job_id)
    if job.status != 'open':
        return jsonify({'error': 'Job is not available for booking'}), 400
    booking = Booking(
        job_id=job.id,
        customer_id=user.id,
        worker_id=payload.get('worker_id'),
        scheduled_date=payload.get('scheduled_date', ''),
        total_amount=payload.get('total_amount', job.rate),
    )
    db.session.add(booking)
    job.status = 'booked'
    db.session.commit()
    return jsonify({'booking': booking.to_dict()}), 201


@jobs_bp.route('/categories', methods=['GET'])
def categories():
    return jsonify({'categories': CATEGORY_OPTIONS})
