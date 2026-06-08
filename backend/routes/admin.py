from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from backend import db
from backend.models.user import User
from backend.models.job import Job
from backend.models.report import Report
from backend.utils.decorators import role_required

admin_bp = Blueprint('admin', __name__)


@admin_bp.route('/users', methods=['GET'])
@jwt_required()
@role_required('admin')
def list_users():
    users = User.query.order_by(User.created_at.desc()).all()
    return jsonify({'users': [user.to_dict() for user in users]})


@admin_bp.route('/jobs', methods=['GET'])
@jwt_required()
@role_required('admin')
def list_jobs():
    jobs = Job.query.order_by(Job.created_at.desc()).all()
    return jsonify({'jobs': [job.to_dict() for job in jobs]})


@admin_bp.route('/reports', methods=['GET'])
@jwt_required()
@role_required('admin')
def reports():
    total_users = User.query.count()
    total_jobs = Job.query.count()
    reports = Report.query.order_by(Report.created_at.desc()).all()
    return jsonify({
        'statistics': {
            'total_users': total_users,
            'total_jobs': total_jobs,
            'open_reports': Report.query.filter_by(status='open').count(),
        },
        'platform_health': 'ok',
        'reports': [report.to_dict() for report in reports],
    })


@admin_bp.route('/users/<int:user_id>/disable', methods=['POST'])
@jwt_required()
@role_required('admin')
def disable_user(user_id):
    user = User.query.get_or_404(user_id)
    if user.role == 'admin':
        return jsonify({'error': 'Cannot disable an admin account.'}), 403
    user.is_active = False
    db.session.commit()
    return jsonify({'message': 'User disabled.', 'user': user.to_dict()})


@admin_bp.route('/users/<int:user_id>/enable', methods=['POST'])
@jwt_required()
@role_required('admin')
def enable_user(user_id):
    user = User.query.get_or_404(user_id)
    user.is_active = True
    db.session.commit()
    return jsonify({'message': 'User enabled.', 'user': user.to_dict()})


@admin_bp.route('/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
@role_required('admin')
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    if user.role == 'admin':
        return jsonify({'error': 'Cannot delete an admin account.'}), 403
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User removed.'})


@admin_bp.route('/reports/<int:report_id>/resolve', methods=['POST'])
@jwt_required()
@role_required('admin')
def resolve_report(report_id):
    payload = request.get_json() or {}
    status = payload.get('status', 'reviewed')
    report = Report.query.get_or_404(report_id)
    report.status = status
    db.session.commit()
    return jsonify({'report': report.to_dict()})
