from flask import request, jsonify
from app.services.notification_service import get_all_notifications, add_notification, delete_notification_by_id

class NotificationController:
    @staticmethod
    def get_notifications():
        notifications = get_all_notifications()
        return jsonify({"success": True, "notifications": notifications})

    @staticmethod
    def create_notification():
        body = request.get_json(silent=True) or {}
        msg  = body.get("message", "").strip()
        ntype = body.get("type", "info")

        if not msg:
            return jsonify({"success": False, "message": "message is required"}), 400

        notif = add_notification(msg, ntype)
        print(f"[Admin] Notification added: {notif}")
        return jsonify({"success": True, "notification": notif}), 201

    @staticmethod
    def delete_notification(notif_id):
        removed = delete_notification_by_id(notif_id)
        if removed:
            return jsonify({"success": True, "message": "Notification removed."})
        return jsonify({"success": False, "message": "Notification not found."}), 404
