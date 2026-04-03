from flask import Blueprint
from app.controllers.speech_controller import SpeechController

speech_bp = Blueprint('speech', __name__)

speech_bp.route('/speech', methods=['POST'])(SpeechController.speech_to_text)
