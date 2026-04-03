from flask import request, jsonify
from app.services.speech_service import detect_speech

class SpeechController:
    @staticmethod
    def speech_to_text():
        if "audio" not in request.files:
            return jsonify({"success": False, "message": "No audio file provided"}), 400

        audio_file = request.files["audio"]
        audio_bytes = audio_file.read()

        try:
            text = detect_speech(audio_bytes)
            return jsonify({"success": True, "text": text})
        except Exception as e:
            print(f"[Speech Error] {e}")
            return jsonify({"success": False, "message": str(e)}), 500
