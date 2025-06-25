from flask import Blueprint, jsonify, session
from sqlalchemy.exc import SQLAlchemyError
import logging

from app import db
from app.models.attack_log_model import AttackLog

user_bp = Blueprint('user_bp', __name__)

@user_bp.route('/', methods=['GET'])
def get_users():
    if 'admin_id' not in session:
        return jsonify({'success': False, 'error': '인증되지 않은 요청입니다.'}), 401
    
    # 이 부분은 원본 코드의 더미 데이터를 그대로 사용합니다.
    # 실제 사용자 테이블이 있다면 DB에서 조회해야 합니다.
    users_data = [
        {"id": 1, "name": "명현만", "username": "strong_HM", "email": "strong_HM@example.com", "ip": "203.0.113.10", "last_login": "2025-06-15 10:30:00 UTC"},
        {"id": 2, "name": "강채민", "username": "NO_CMG", "email": "NO_CMG@example.com", "ip": "198.51.100.25", "last_login": "2025-06-16 09:15:00 UTC"},
        {"id": 3, "name": "김수현", "username": "Im_your_man", "email": "Im_your_man@example.com", "ip": "172.16.0.5", "last_login": "2025-06-16 14:00:00 UTC"},
        {"id": 4, "name": "임채연", "username": "SSG_LOVE", "email": "SSG_love@example.com", "ip": "10.0.0.11", "last_login": "2025-06-16 16:20:00 UTC"},
    ]
    return jsonify(users_data)

@user_bp.route('/<username_param>/logs', methods=['GET'])
def get_user_logs(username_param):
    if 'admin_id' not in session:
        return jsonify({'success': False, 'error': '인증되지 않은 요청입니다.'}), 401
    
    try:
        user_logs = AttackLog.query.filter_by(username=username_param).order_by(AttackLog.timestamp.desc()).all()
        return jsonify([{
            "id": log.id, "timestamp": log.timestamp.strftime("%Y-%m-%d %H:%M:%S UTC"),
            "username": log.username, "ip": log.ip, "attack_type": log.attack_type,
            "original": log.original, "cleaned": log.cleaned,
            "detected_attack_types": log.detected_attack_types
        } for log in user_logs])
    except SQLAlchemyError as e:
        logging.error(f"get_user_logs DB error: {e}")
        return jsonify({'success': False, 'error': '데이터베이스 오류'}), 500