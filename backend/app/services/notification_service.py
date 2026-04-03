import uuid
from datetime import datetime

_NOTIFICATIONS = []

def get_all_notifications():
    return _NOTIFICATIONS

def add_notification(message, ntype="info"):
    notif = {
        "id":        str(uuid.uuid4()),
        "message":   message,
        "type":      ntype,
        "createdAt": datetime.now().strftime("%d %b %Y, %I:%M %p")
    }
    _NOTIFICATIONS.append(notif)
    return notif

def delete_notification_by_id(notif_id):
    global _NOTIFICATIONS
    before = len(_NOTIFICATIONS)
    _NOTIFICATIONS = [n for n in _NOTIFICATIONS if n["id"] != notif_id]
    return len(_NOTIFICATIONS) < before
