from flask import Blueprint
from app.controllers.chatbot_controller import ChatbotController

chatbot_bp = Blueprint('chatbot', __name__)

chatbot_bp.route('/verify', methods=['POST'])(ChatbotController.verify_student)
chatbot_bp.route('/otp/verify', methods=['POST'])(ChatbotController.verify_otp)
chatbot_bp.route('/query', methods=['POST'])(ChatbotController.chatbot_query)
