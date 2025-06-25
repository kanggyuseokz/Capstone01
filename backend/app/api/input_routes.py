from flask import Blueprint, request, jsonify
from datetime import datetime, timezone
import logging

from app.models.blocked_ip_model import BlockedIP
from app.core.security import (
    UserInfo, UserInput, XSSDetect, SQLIDetect, PathTraversalDetect,
    CommandInjectionDetect, manage_attack_and_block_unified, verify_api_key
)

input_bp = Blueprint('input_bp', __name__)

@input_bp.route('/input', methods=['POST'])
def handle_input():
    # API 키 검증
    api_key = request.headers.get('X-API-Key')
    if not verify_api_key(api_key):
        return jsonify({"error": "Invalid API Key"}), 401

    # IP 차단 여부 확인
    ip = request.headers.get("X-Forwarded-For", request.remote_addr)
    blocked_entry = BlockedIP.query.filter_by(ip=ip).first()
    if blocked_entry and (blocked_entry.expires_at is None or blocked_entry.expires_at > datetime.now(timezone.utc)):
        return jsonify({"error": f"IP {ip}는 차단되었습니다."}), 403

    data = request.get_json()
    if not data or 'inputText' not in data or 'username' not in data:
        return jsonify({"error": "Missing required fields"}), 400

    user = UserInfo(username=data['username'], ip=ip)
    user_input = UserInput(input_text=data['inputText'], user=user)

    detected_attacks_results = {}
    engines = {
        'XSS': XSSDetect(),
        'SQL_Injection': SQLIDetect(),
        'Path_Traversal': PathTraversalDetect(),
        'Command_Injection': CommandInjectionDetect()
    }

    for name, engine in engines.items():
        result = engine.processInput(user_input)
        if result['detected']:
            detected_attacks_results[name] = result

    if detected_attacks_results:
        manage_attack_and_block_unified(user_input, detected_attacks_results)

    response = {
        "status": "processed",
        "detected_attacks": detected_attacks_results,
        "safe": not bool(detected_attacks_results)
    }
    return jsonify(response)