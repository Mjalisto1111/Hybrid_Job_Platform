from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend import db
from backend.models.message import Message, Conversation
from backend.models.user import User

chat_bp = Blueprint('chat', __name__)


@chat_bp.route('/conversations', methods=['GET'])
@jwt_required()
def conversations():
    user_id = int(get_jwt_identity())
    convos = Conversation.query.join(Message).filter(
        (Message.sender_id == user_id) | (Message.receiver_id == user_id)
    ).distinct().all()
    return jsonify({'conversations': [conv.to_dict() for conv in convos]})


@chat_bp.route('/conversations', methods=['POST'])
@jwt_required()
def create_conversation():
    payload = request.get_json() or {}
    title = payload.get('title')
    participants = payload.get('participant_ids', [])
    if not participants:
        return jsonify({'error': 'At least one participant is required.'}), 400
    conversation = Conversation(title=title)
    db.session.add(conversation)
    db.session.commit()
    return jsonify({'conversation': conversation.to_dict()}), 201


@chat_bp.route('/messages/<int:conversation_id>', methods=['GET'])
@jwt_required()
def messages(conversation_id):
    conversation = Conversation.query.get_or_404(conversation_id)
    return jsonify({'messages': [message.to_dict() for message in conversation.participants.order_by(Message.created_at)]})


@chat_bp.route('/messages', methods=['POST'])
@jwt_required()
def send_message():
    payload = request.get_json() or {}
    sender_id = int(get_jwt_identity())
    message = Message(
        conversation_id=payload.get('conversation_id'),
        sender_id=sender_id,
        receiver_id=payload.get('receiver_id'),
        content=payload.get('content', ''),
        attachment_url=payload.get('attachment_url'),
    )
    db.session.add(message)
    db.session.commit()
    return jsonify({'message': message.to_dict()}), 201
