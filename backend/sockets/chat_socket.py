from flask_socketio import join_room, leave_room, emit


def register_socket_handlers(socketio):
    @socketio.on('join_room')
    def on_join(data):
        room = data.get('room')
        join_room(room)
        emit('user_joined', {'room': room, 'user': data.get('user_id')}, to=room)

    @socketio.on('leave_room')
    def on_leave(data):
        room = data.get('room')
        leave_room(room)
        emit('user_left', {'room': room, 'user': data.get('user_id')}, to=room)

    @socketio.on('typing')
    def on_typing(data):
        room = data.get('room')
        emit('typing', {'user_id': data.get('user_id'), 'typing': data.get('typing')}, to=room)

    @socketio.on('private_message')
    def on_private_message(data):
        room = data.get('room')
        payload = {
            'sender_id': data.get('sender_id'),
            'receiver_id': data.get('receiver_id'),
            'content': data.get('content'),
            'attachment_url': data.get('attachment_url'),
            'timestamp': data.get('timestamp'),
        }
        emit('message_received', payload, to=room)
