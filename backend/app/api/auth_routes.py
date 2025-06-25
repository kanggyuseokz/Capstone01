from flask import Blueprint, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.exc import SQLAlchemyError
import logging

from app import db
from app.models.admin_model import Admin

auth_bp = Blueprint('auth_bp', __name__)

@auth_bp.route('/register', methods=['POST'])
def register_admin():
    # ... /api/register 로직 ...
    data = request.get_json()
    if not all(k in data for k in ('name', 'username', 'password', 'email')):
        return jsonify({'success': False, 'error': '필수 정보 누락'}), 400
    
    if Admin.query.filter_by(username=data['username']).first():
        return jsonify({'success': False, 'error': '이미 존재하는 아이디입니다.'}), 409

    hashed_password = generate_password_hash(data['password'])
    new_admin = Admin(name=data['name'], username=data['username'], password=hashed_password, email=data['email'], isApproved=False)
    db.session.add(new_admin)
    db.session.commit()
    return jsonify({'success': True}), 201


@auth_bp.route('/login', methods=['POST'])
def login_admin():
    # ... /api/login 로직 ...
    data = request.get_json()
    admin = Admin.query.filter_by(username=data.get('username')).first()
    if not admin or not check_password_hash(admin.password, data.get('password')):
        return jsonify({'success': False, 'error': '아이디 또는 비밀번호가 올바르지 않습니다.'}), 401
    
    if not admin.isApproved:
        return jsonify({'success': False, 'error': '승인 대기 중인 계정입니다.'}), 403

    session['admin_id'] = admin.id
    session['username'] = admin.username
    return jsonify({'success': True, 'username': admin.username, 'admin_id': admin.id})


@auth_bp.route('/logout', methods=['POST'])
def logout_admin():
    # ... /api/logout 로직 ...
    session.clear()
    return jsonify({'success': True})


@auth_bp.route('/check_auth', methods=['GET'])
def check_auth():
    # ... /api/check_auth 로직 ...
    if 'admin_id' in session:
        admin = db.session.get(Admin, session['admin_id'])
        if admin and admin.isApproved:
            return jsonify({'success': True, 'username': admin.username, 'admin_id': admin.id})
    return jsonify({'success': False}), 401