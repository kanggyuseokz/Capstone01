from flask import Blueprint, jsonify, session
from sqlalchemy.exc import SQLAlchemyError
import logging

from app import db
from app.models.attack_log_model import AttackLog

log_bp = Blueprint('log_bp', __name__)

@log_bp.route('/', methods=['GET'])
def get_logs():
    if 'admin_id' not in session:
        return jsonify({'success': False, 'error': '인증되지 않은 요청입니다.'}), 401

    try:
        logs = AttackLog.query.order_by(AttackLog.id.desc()).all()
        return jsonify([{
            "id": log.id, "timestamp": log.timestamp.strftime("%Y-%m-%d %H:%M:%S UTC"),
            "username": log.username, "ip": log.ip, "attack_type": log.attack_type,
            "original": log.original, "cleaned": log.cleaned,
            "detected_attack_types": log.detected_attack_types
        } for log in logs])
    except SQLAlchemyError as e:
        logging.error(f"get_logs DB error: {e}")
        return jsonify({'success': False, 'error': '데이터베이스 오류'}), 500

@log_bp.route('/all', methods=['DELETE'])
def delete_all_logs():
    if 'admin_id' not in session:
        return jsonify({'success': False, 'error': '인증되지 않은 요청입니다.'}), 401

    try:
        num_rows_deleted = db.session.query(AttackLog).delete()
        db.session.commit()
        return jsonify({'success': True, 'message': f'{num_rows_deleted}개의 로그가 삭제되었습니다.'})
    except SQLAlchemyError as e:
        db.session.rollback()
        logging.error(f"delete_all_logs DB error: {e}")
        return jsonify({'success': False, 'error': '데이터베이스 오류'}), 500

@log_bp.route('/<int:log_id>', methods=['DELETE'])
def delete_single_log(log_id):
    if 'admin_id' not in session:
        return jsonify({'success': False, 'error': '인증되지 않은 요청입니다.'}), 401

    try:
        log_to_delete = db.session.get(AttackLog, log_id)
        if not log_to_delete:
            return jsonify({'success': False, 'error': '로그를 찾을 수 없습니다.'}), 404

        db.session.delete(log_to_delete)
        db.session.commit()
        return jsonify({'success': True, 'message': f'로그 (ID: {log_id})가 삭제되었습니다.'})
    except SQLAlchemyError as e:
        db.session.rollback()
        logging.error(f"delete_single_log DB error: {e}")
        return jsonify({'success': False, 'error': '데이터베이스 오류'}), 500