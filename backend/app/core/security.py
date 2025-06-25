import re
import bleach
import logging
from datetime import datetime, timedelta, timezone
from flask import current_app
from flask_mail import Message

from app import db, mail
from app.models.attack_log_model import AttackLog
from app.models.blocked_ip_model import BlockedIP

# --- 유틸리티 클래스 ---
class UserInfo:
    def __init__(self, username: str, ip: str):
        self.username = username
        self.ip = ip
    def __str__(self):
        return f"{self.username} ({self.ip})"

class UserInput:
    def __init__(self, input_text: str, user: UserInfo, timestamp: datetime = None):
        self.input_text = input_text
        self.user = user
        self.timestamp = timestamp if timestamp else datetime.now(timezone.utc)
    def __str__(self):
        return f"[{self.timestamp}] {self.user}: {self.input_text}"

# --- 탐지 엔진 클래스 ---
class XSSDetect:
    def detect(self, input_obj: UserInput) -> bool:
        # ... XSSDetect.detect 로직 ...
        text = input_obj.input_text.lower()
        xss_patterns = [
            r'<script\b[^>]*>(.*?)</script>', r'javascript:', r'data:text/html',
            r'on[a-zA-Z]+\s*=', r'<\s*iframe\b', r'<\s*img\b[^>]*src\s*=\s*[\'"]?javascript:',
            r'expression\(', r'eval\(', r'alert\(', r'prompt\(', r'confirm\(',
            r'<[^>]*\s+style\s*=\s*[\'"]?[^>]*expression\(', r'&lt;script&gt;', r'%3cscript%3e'
        ]
        return any(re.search(pattern, text, re.IGNORECASE | re.DOTALL) for pattern in xss_patterns)

    def cleanInput(self, input_obj: UserInput) -> str:
        # ... XSSDetect.cleanInput 로직 ...
        allowed_tags = ['a', 'abbr', 'acronym', 'b', 'blockquote', 'code', 'em', 'i', 'li', 'ol', 'p', 'strong', 'ul', 'br', 'hr']
        allowed_attrs = {'a': ['href', 'title']}
        return bleach.clean(input_obj.input_text, tags=allowed_tags, attributes=allowed_attrs, strip=True, strip_comments=True)

    def processInput(self, user_input_obj: UserInput):
        # ... XSSDetect.processInput 로직 ...
        is_attack = self.detect(user_input_obj)
        cleaned = self.cleanInput(user_input_obj) if is_attack else user_input_obj.input_text
        return {"detected": is_attack, "cleaned_input": cleaned}

class SQLIDetect:
    # ... SQLIDetect 클래스 전체 ...
    def __init__(self):
        self.patterns = [
            r'\b(SELECT|UNION|INSERT|UPDATE|DELETE|FROM|WHERE|AND|OR|HAVING|ORDER BY|GROUP BY|SLEEP|BENCHMARK|EXEC|DROP|CREATE|ALTER|TRUNCATE)\b',
            r'--', r'#', r';', r'/\*', r'\*/', r'\'\s*OR\s*\'\d+\'=\'\d+', r'\"?\s*OR\s*\"?\d+\"?=\"?\d+',
            r'\'\s*=\s*\'', r'xp_cmdshell', r'(\bEXEC\b|\bINSERT\b|\bDROP\b|\bUNION\b|\bSELECT\b).*?(\bFROM\b|\bWHERE\b|\bINTO\b)',
            r'CAST\(.+?AS.+?\)', r'CONVERT\(.+?USING.+?\)', r'information_schema', r'pg_sleep', r'sys\.xp_cmdshell',
            r'payload=|query=|select\s+.*?\s+from\s+.*?'
        ]

    def detect(self, input: UserInput) -> bool:
        return any(re.search(pattern, input.input_text, re.IGNORECASE | re.DOTALL) for pattern in self.patterns)

    def cleanInput(self, input: UserInput) -> str:
        # ... SQLIDetect.cleanInput 로직 ...
        cleaned_input = input.input_text
        cleaned_input = re.sub(r'--.*', '', cleaned_input)
        cleaned_input = cleaned_input.replace("'", "''")
        return cleaned_input

    def processInput(self, user_input_obj: UserInput):
        is_attack = self.detect(user_input_obj)
        cleaned = self.cleanInput(user_input_obj) if is_attack else user_input_obj.input_text
        return {"detected": is_attack, "cleaned_input": cleaned}


class PathTraversalDetect:
    # ... PathTraversalDetect 클래스 전체 ...
    def __init__(self):
        self.patterns = [
            r'\.\./', r'\.\.\\', r'%2e%2e%2f', r'%2e%2e%5c', r'../', r'..\/',
            r'\.\/(\.\/)?', r'[A-Za-z]:[/\\]', r'\/etc\/passwd', r'\/proc\/self\/environ'
        ]

    def detect(self, input: UserInput) -> bool:
        return any(re.search(pattern, input.input_text, re.IGNORECASE) for pattern in self.patterns)

    def cleanInput(self, input: UserInput) -> str:
        cleaned_input = input.input_text
        replacements = { r'\.\./': '', r'\.\.\\': '' }
        for pattern, replacement in replacements.items():
            cleaned_input = re.sub(pattern, replacement, cleaned_input, flags=re.IGNORECASE)
        return cleaned_input

    def processInput(self, user_input_obj: UserInput):
        is_attack = self.detect(user_input_obj)
        cleaned = self.cleanInput(user_input_obj) if is_attack else user_input_obj.input_text
        return {"detected": is_attack, "cleaned_input": cleaned}


class CommandInjectionDetect:
    # ... CommandInjectionDetect 클래스 전체 ...
    def __init__(self):
        self.patterns = [
            r'&&', r'\|\|', r';', r'`.*?`', r'\$\(.*?\)', r'\|',
            r'\b(cat|ls|rm|chmod|wget|curl|nc|bash|sh|cmd|powershell)\b',
            r'&[a-zA-Z0-9_]+;', r'%26%26', r'%7c%7c', r'%3b'
        ]

    def detect(self, input: UserInput) -> bool:
        return any(re.search(pattern, input.input_text, re.IGNORECASE | re.DOTALL) for pattern in self.patterns)

    def cleanInput(self, input: UserInput) -> str:
        cleaned_input = input.input_text
        replacements = { r'&&': ' ', r'\|\|': ' ', r';': ' ' }
        for pattern, replacement in replacements.items():
            cleaned_input = re.sub(pattern, replacement, cleaned_input, flags=re.IGNORECASE | re.DOTALL)
        return cleaned_input

    def processInput(self, user_input_obj: UserInput):
        is_attack = self.detect(user_input_obj)
        cleaned = self.cleanInput(user_input_obj) if is_attack else user_input_obj.input_text
        return {"detected": is_attack, "cleaned_input": cleaned}


# --- 헬퍼 함수 ---
def send_alert_email(attack_types: list[str], user_input_obj: UserInput, cleaned_texts: dict):
    # ... send_alert_email 함수 로직 ...
    recipients = [current_app.config['ALERT_RECIPIENT']]
    if not recipients[0]:
        logging.warning("ALERT_RECIPIENT is not set. Skipping email alert.")
        return

    subject = f"[경고] 통합 공격 탐지됨: {', '.join(attack_types)}!"
    body = f"""[보안 경고] 통합 공격 탐지됨!
시간: {user_input_obj.timestamp.strftime('%Y-%m-%d %H:%M:%S UTC')}
사용자: {user_input_obj.user.username} (IP: {user_input_obj.user.ip})
원본 입력: {user_input_obj.input_text}
--- 탐지된 공격 상세 ---
"""
    for attack_type, cleaned_text in cleaned_texts.items():
        body += f"유형: {attack_type}\n정제 결과: {cleaned_text}\n"
    
    msg = Message(subject=subject, recipients=recipients, body=body, sender=current_app.config['MAIL_DEFAULT_SENDER'])
    try:
        mail.send(msg)
        logging.info(f"Alert email sent to {recipients[0]}")
    except Exception as e:
        logging.error(f"Failed to send email: {e}")


def block_ip(ip: str, reason: str, duration_hours: int):
    # ... block_ip 함수 로직 ...
    expires_at = datetime.now(timezone.utc) + timedelta(hours=duration_hours)
    blocked_entry = BlockedIP.query.filter_by(ip=ip).first()
    if blocked_entry:
        blocked_entry.count += 1
        blocked_entry.expires_at = expires_at
    else:
        new_block = BlockedIP(ip=ip, reason=reason, expires_at=expires_at, count=1)
        db.session.add(new_block)
    db.session.commit()
    logging.info(f"IP {ip} blocked for {duration_hours} hours. Reason: {reason}")


def manage_attack_and_block_unified(user_input: UserInput, detected_attacks_info: dict):
    # ... manage_attack_and_block_unified 함수 로직 ...
    attack_types_list = list(detected_attacks_info.keys())
    if not attack_types_list:
        return

    # 1. 로그 기록
    cleaned_texts_for_email = {k: v['cleaned_input'] for k, v in detected_attacks_info.items()}
    log = AttackLog(
        timestamp=user_input.timestamp, username=user_input.user.username, ip=user_input.user.ip,
        attack_type="통합 공격", original=user_input.input_text,
        cleaned=", ".join(cleaned_texts_for_email.values()),
        detected_attack_types=",".join(attack_types_list)
    )
    db.session.add(log)
    db.session.commit()

    # 2. IP 차단 로직
    ip = user_input.user.ip
    time_window = datetime.now(timezone.utc) - timedelta(minutes=current_app.config['BLOCK_TIME_WINDOW_MINUTES'])
    recent_attacks = AttackLog.query.filter(AttackLog.ip == ip, AttackLog.timestamp >= time_window).count()
    
    if recent_attacks >= current_app.config['BLOCK_THRESHOLD']:
        reason_str = f"반복적인 공격 ({', '.join(attack_types_list)})"
        block_ip(ip, reason_str, current_app.config['BLOCK_DURATION_HOURS'])
    
    # 3. 이메일 알림
    send_alert_email(attack_types_list, user_input, cleaned_texts_for_email)


def verify_api_key(api_key_header):
    VALID_API_KEY = current_app.config.get('API_KEY')
    return api_key_header == VALID_API_KEY