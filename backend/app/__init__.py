from flask import Flask, jsonify
from flask_cors import CORS
from app.config.config import Config

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    # Import blueprints
    from app.routes.chatbot_routes import chatbot_bp
    from app.routes.speech_routes import speech_bp
    from app.routes.notification_routes import notification_bp
    
    # Register blueprints
    app.register_blueprint(chatbot_bp, url_prefix='/api')
    app.register_blueprint(speech_bp, url_prefix='/api')
    app.register_blueprint(notification_bp, url_prefix='/api')
    
    # Health check route
    @app.route("/", methods=["GET"])
    def index():
        return jsonify({"status": "ok", "message": "EduConnect Backend running ✅"})
        
    return app
