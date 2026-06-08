from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend import db
from backend.models.user import User
from backend.models.profile import WorkerProfile, Skill
from backend.models.report import Report
from backend.services.search_service import search_workers
from backend.utils.decorators import role_required

users_bp = Blueprint('users', __name__)


@users_bp.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    current_user = User.query.get(int(get_jwt_identity()))
    return jsonify({'user': current_user.to_dict()})


@users_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    payload = request.get_json() or {}
    user = User.query.get(int(get_jwt_identity()))
    user.name = payload.get('name', user.name)
    user.location = payload.get('location', user.location)
    user.bio = payload.get('bio', user.bio)
    user.avatar_url = payload.get('avatar_url', user.avatar_url)
    db.session.commit()
    return jsonify({'user': user.to_dict()})


@users_bp.route('/search', methods=['GET'])
def search():
    args = request.args
    skill = args.get('skill')
    location = args.get('location')
    category = args.get('category')
    min_rate = args.get('min_rate')
    max_rate = args.get('max_rate')
    workers = search_workers(skill, location, category, min_rate, max_rate)
    return jsonify({'workers': [worker.to_dict() for worker in workers]})


@users_bp.route('/favorites', methods=['GET'])
@jwt_required()
def favorites():
    user = User.query.get(int(get_jwt_identity()))
    favorites = [favorite.worker.to_dict() for favorite in getattr(user, 'favorites', [])]
    return jsonify({'favorites': favorites})


@users_bp.route('/reports', methods=['GET'])
@jwt_required()
def user_reports():
    user = User.query.get(int(get_jwt_identity()))
    reports = Report.query.filter_by(reporter_id=user.id).order_by(Report.created_at.desc()).all()
    return jsonify({'reports': [report.to_dict() for report in reports]})


@users_bp.route('/reports', methods=['POST'])
@jwt_required()
def create_report():
    payload = request.get_json() or {}
    reporter = User.query.get(int(get_jwt_identity()))
    target_id = payload.get('target_id')
    reason = payload.get('reason')
    details = payload.get('details')
    if not target_id or not reason:
        return jsonify({'error': 'Target and reason are required.'}), 400

    target = User.query.get(target_id)
    if not target:
        return jsonify({'error': 'Target user not found.'}), 404

    report = Report(reporter_id=reporter.id, target_id=target.id, reason=reason, details=details)
    db.session.add(report)
    db.session.commit()
    return jsonify({'report': report.to_dict()}), 201


@users_bp.route('/skills', methods=['GET'])
def skills():
    all_skills = Skill.query.order_by(Skill.name).all()
    return jsonify({'skills': [skill.to_dict() for skill in all_skills]})
