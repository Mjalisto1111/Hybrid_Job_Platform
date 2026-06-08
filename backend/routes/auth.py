from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from backend import db
from backend.models.user import User
from backend.utils.decorators import role_required
from backend.utils.helpers import send_email

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/register', methods=['POST'])
def register():
    payload = request.get_json() or {}
    email = payload.get('email')
    password = payload.get('password')
    name = payload.get('name')
    role = payload.get('role', 'customer')

    allowed_roles = {'customer', 'worker', 'employer'}
    if not email or not password or not name:
        return jsonify({'error': 'Name, email, and password are required'}), 400

    if role == 'admin':
        return jsonify({'error': 'Admin accounts cannot be created through public registration.'}), 403

    if role not in allowed_roles:
        return jsonify({'error': f'Invalid role. Allowed roles: {", ".join(sorted(allowed_roles))}.'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already exists'}), 400

    user = User(email=email, name=name, role=role, is_verified=True)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    verify_token = create_access_token(identity=str(user.id))
    send_email(email, 'Verify your SkillConnect SA account', f'Use this token to verify your email: {verify_token}')

    return jsonify({'message': 'Account created. You can now sign in.', 'user': user.to_dict()}), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    payload = request.get_json() or {}
    email = payload.get('email')
    password = payload.get('password')

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({'error': 'Invalid credentials'}), 401

    if not user.is_active:
        return jsonify({'error': 'Account disabled. Contact support.'}), 403

    if not user.is_verified:
        return jsonify({'error': 'Email not verified. Please verify your account.'}), 403

    access_token = create_access_token(identity=str(user.id))
    refresh_token = create_refresh_token(identity=str(user.id))
    return jsonify({
        'access_token': access_token,
        'refresh_token': refresh_token,
        'user': user.to_dict(),
    })


@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    access_token = create_access_token(identity=str(identity))
    return jsonify({'access_token': access_token})


@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    payload = request.get_json() or {}
    email = payload.get('email')
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'message': 'If the email exists we have sent reset instructions.'}), 200

    reset_token = create_access_token(identity=str(user.id))
    send_email(email, 'Reset your SkillConnect SA password', f'Use this token to reset your password: {reset_token}')
    return jsonify({'message': 'Password reset instructions sent.'}), 200


@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    payload = request.get_json() or {}
    token = payload.get('token')
    password = payload.get('password')
    from flask_jwt_extended import decode_token

    try:
        data = decode_token(token)
        user_id = int(data['sub'])
    except Exception:
        return jsonify({'error': 'Invalid reset token'}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    user.set_password(password)
    db.session.commit()
    return jsonify({'message': 'Password updated successfully.'})


@auth_bp.route('/verify-email', methods=['POST'])
def verify_email():
    payload = request.get_json() or {}
    token = payload.get('token')
    from flask_jwt_extended import decode_token

    try:
        data = decode_token(token)
        user_id = int(data['sub'])
    except Exception:
        return jsonify({'error': 'Invalid verification token'}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    user.is_verified = True
    db.session.commit()
    return jsonify({'message': 'Email verified successfully.'})
