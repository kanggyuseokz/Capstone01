from flask import Blueprint, jsonify, session
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime, timezone
import logging

from app import db
from app.models.blocked_ip_model import BlockedIP

ip_bp = Blueprint('ip_bp', __name__)

@ip_bp.route('/', methods=['GET'])
def get_blocked_ips():
    if 'admin_id' not in session:
        return jsonify({'success': False, 'error': '인증되지 않은 요청입니다.'}), 401

    try:
        blocked_ips = BlockedIP.query.filter(
            (BlockedIP.expires_at == None) | (BlockedIP.expires_at > datetime.now(timezone.utc))
        ).all()
        return jsonify([{
            "id": ip.id, "ip": ip.ip, "count": ip.count, "reason": ip.reason,
            "blocked_at": ip.blocked_at.strftime("%Y-%m-%d %H:%M:%S UTC"),
            "expires_at": ip.expires_at.strftime("%Y-%m-%d %H:%M:%S UTC") if ip.expires_at else "영구 차단"
        } for ip in blocked_ips])
    except SQLAlchemyError as e:
        logging.error(f"get_blocked_ips DB error: {e}")
        return jsonify({'success': False, 'error': '데이터베이스 오류'}), 500

@ip_bp.route('/<int:ip_id>', methods=['DELETE'])
def unblock_ip(ip_id):
    if 'admin_id' not in session:
        return jsonify({'success': False, 'error': '인증되지 않은 요청입니다.'}), 401

    try:
        blocked_ip = db.session.get(BlockedIP, ip_id)
        if not blocked_ip:
            return jsonify({'success': False, 'error': '차단된 IP를 찾을 수 없습니다.'}), 404

        db.session.delete(blocked_ip)
        db.session.commit()
        return jsonify({'success': True})
    except SQLAlchemyError as e:
        db.session.rollback()
        logging.error(f"unblock_ip DB error: {e}")
        return jsonify({'success': False, 'error': '데이터베이스 오류'}), 500