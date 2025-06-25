from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_mail import Mail
import logging

from .config import Config

db = SQLAlchemy()
mail = Mail()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    mail.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": ["http://localhost:3000", "http://localhost:8000"]}}, supports_credentials=True)

    with app.app_context():
        # 모델 임포트
        from .models import admin_model, attack_log_model, blocked_ip_model
        
        # 블루프린트 임포트
        from .api.auth_routes import auth_bp
        from .api.admin_routes import admin_bp
        from .api.log_routes import log_bp
        from .api.ip_routes import ip_bp
        from .api.user_routes import user_bp
        from .api.input_routes import input_bp

        # 블루프린트 등록 (URL Prefix 수정)
        app.register_blueprint(auth_bp, url_prefix='/api')
        app.register_blueprint(admin_bp, url_prefix='/api/admins')
        app.register_blueprint(log_bp, url_prefix='/api/admin/logs')
        app.register_blueprint(ip_bp, url_prefix='/api/blocked_ips')
        app.register_blueprint(user_bp, url_prefix='/api/users')
        app.register_blueprint(input_bp, url_prefix='/api')

        # 전역 에러 핸들러
        @app.errorhandler(500)
        def handle_internal_server_error(e):
            logging.exception("An internal server error occurred")
            return jsonify({
                'success': False,
                'error': '내부 서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
                'detail': str(e) 
            }), 500

        try:
            db.create_all()
            logging.info("Database tables created or already exist.")
        except Exception as e:
            logging.error(f"Database connection/creation failed: {e}")

    return app