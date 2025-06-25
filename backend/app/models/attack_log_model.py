from app import db
from datetime import datetime, timezone

class AttackLog(db.Model):
    __tablename__ = 'attack_logs'
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    username = db.Column(db.String(100))
    ip = db.Column(db.String(100))
    attack_type = db.Column(db.String(255))
    original = db.Column(db.Text)
    cleaned = db.Column(db.Text)
    detected_attack_types = db.Column(db.String(255), nullable=True)