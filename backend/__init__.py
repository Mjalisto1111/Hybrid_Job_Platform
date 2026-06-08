from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO
from dotenv import load_dotenv
import os

load_dotenv()

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
socketio = SocketIO(cors_allowed_origins='*', ping_interval=25, ping_timeout=60)


def create_app() -> Flask:
    app = Flask(__name__, instance_relative_config=False)
    app.config.from_object('backend.config.Config')

    # Avoid Flask auto-redirects for routes with/without trailing slashes
    app.url_map.strict_slashes = False

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    socketio.init_app(app)
    # Allow frontend origins (dev) and echo origin for credentialed requests
    frontend_origins = [app.config.get('FRONTEND_URL')] if app.config.get('FRONTEND_URL') else []
    # include common dev ports
    frontend_origins.extend(['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174'])
    CORS(app, resources={r"/api/*": {"origins": frontend_origins}}, supports_credentials=True, expose_headers=['Content-Type'])

    from backend.models.user import User

    with app.app_context():
        db.create_all()

        admin_email = os.getenv('ADMIN_EMAIL')
        admin_password = os.getenv('ADMIN_PASSWORD')
        if admin_email and admin_password and not User.query.filter_by(role='admin').first():
            if not User.query.filter_by(email=admin_email).first():
                admin_user = User(email=admin_email, name='Administrator', role='admin', is_verified=True)
                admin_user.set_password(admin_password)
                db.session.add(admin_user)
                db.session.commit()

    from backend.routes.auth import auth_bp
    from backend.routes.users import users_bp
    from backend.routes.jobs import jobs_bp
    from backend.routes.chat import chat_bp
    from backend.routes.admin import admin_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    app.register_blueprint(jobs_bp, url_prefix='/api/jobs')
    app.register_blueprint(chat_bp, url_prefix='/api/chat')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')

    @app.route('/')
    def health_check():
        return {
            'status': 'ok',
            'service': 'SkillConnect SA Backend',
            'api_root': '/api'
        }, 200

    @app.route('/api')
    def api_index():
        return {
            'status': 'ok',
            'api_groups': [
                '/api/auth',
                '/api/users',
                '/api/jobs',
                '/api/chat',
                '/api/admin'
            ],
            'note': 'Use POST for auth actions and GET for listings/details.'
        }, 200

    from backend.sockets.chat_socket import register_socket_handlers
    register_socket_handlers(socketio)

    return app
