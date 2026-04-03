from flask import Blueprint
from app.controllers.notification_controller import NotificationController

notification_bp = Blueprint('notification', __name__)

notification_bp.route('/notifications', methods=['GET'])(NotificationController.get_notifications)
notification_bp.route('/notifications', methods=['POST'])(NotificationController.create_notification)
notification_bp.route('/notifications/<notif_id>', methods=['DELETE'])(NotificationController.delete_notification)
