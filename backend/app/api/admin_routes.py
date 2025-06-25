from flask import Blueprint, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.exc import SQLAlchemyError
import logging

from app import db
from app.models.admin_model import Admin

admin_bp = Blueprint('admin_bp', __name__)

@admin_bp.route('/', methods=['GET'])
def get_admins():
    if 'admin_id' not in session:
        return jsonify({'success': False, 'error': '인증되지 않은 요청입니다.'}), 401

    try:
        admins = Admin.query.all()
        return jsonify([{
            'id': admin.id, 'name': admin.name, 'username': admin.username,
            'email': admin.email, 'isApproved': admin.isApproved
        } for admin in admins])
    except SQLAlchemyError as e:
        logging.error(f"get_admins DB error: {e}")
        return jsonify({'success': False, 'error': '데이터베이스 오류'}), 500

@admin_bp.route('/<int:admin_id>', methods=['PATCH'])
def update_admin(admin_id):
    if 'admin_id' not in session or session['admin_id'] != admin_id:
        return jsonify({'success': False, 'error': '권한이 없습니다.'}), 403

    try:
        data = request.get_json()
        admin = db.session.get(Admin, admin_id)
        if not admin:
            return jsonify({'success': False, 'error': '관리자를 찾을 수 없습니다.'}), 404

        if 'currentPassword' in data and data['currentPassword']:
            if not check_password_hash(admin.password, data['currentPassword']):
                return jsonify({'success': False, 'error': '현재 비밀번호가 올바르지 않습니다.'}), 403
            if 'newPassword' in data and data['newPassword']:
                admin.password = generate_password_hash(data['newPassword'])
        
        if 'email' in data and data['email']:
            admin.email = data['email']

        db.session.commit()
        return jsonify({'success': True})
    except SQLAlchemyError as e:
        db.session.rollback()
        logging.error(f"update_admin DB error: {e}")
        return jsonify({'success': False, 'error': '데이터베이스 오류'}), 500

@admin_bp.route('/<int:admin_id>', methods=['DELETE'])
def delete_admin(admin_id):
    if 'admin_id' not in session:
        return jsonify({'success': False, 'error': '인증되지 않은 요청입니다.'}), 401
    if session['admin_id'] == admin_id:
        return jsonify({'success': False, 'error': '자신의 계정은 삭제할 수 없습니다.'}), 403

    try:
        admin = db.session.get(Admin, admin_id)
        if not admin:
            return jsonify({'success': False, 'error': '관리자를 찾을 수 없습니다.'}), 404

        db.session.delete(admin)
        db.session.commit()
        return jsonify({'success': True})
    except SQLAlchemyError as e:
        db.session.rollback()
        logging.error(f"delete_admin DB error: {e}")
        return jsonify({'success': False, 'error': '데이터베이스 오류'}), 500

@admin_bp.route('/approve/<int:admin_id>', methods=['POST'])
def approve_admin(admin_id):
    if 'admin_id' not in session:
        return jsonify({'success': False, 'error': '인증되지 않은 요청입니다.'}), 401
    
    try:
        admin = db.session.get(Admin, admin_id)
        if not admin:
            return jsonify({'success': False, 'error': '관리자를 찾을 수 없습니다.'}), 404

        data = request.get_json()
        if 'isApproved' in data:
            admin.isApproved = data['isApproved']
            db.session.commit()
            return jsonify({'success': True})
        return jsonify({'success': False, 'error': '승인 값 누락'}), 400
    except SQLAlchemyError as e:
        db.session.rollback()
        logging.error(f"approve_admin DB error: {e}")
        return jsonify({'success': False, 'error': '데이터베이스 오류'}), 500