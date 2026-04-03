from flask import request, jsonify
from app.services.chatbot_service import get_student_info, handle_query
from app.services.otp_service import create_otp, verify_user_otp

class ChatbotController:
    @staticmethod
    def verify_student():
        body  = request.get_json(silent=True) or {}
        reg_no = body.get("regNo", "").strip()
        phone = body.get("phone", "").strip()

        if not reg_no:
            return jsonify({"success": False, "message": "regNo is required"}), 400

        info = get_student_info(reg_no, phone)
        
        if info is None:
            return jsonify({
                "success": False,
                "message": f"No student found with registration number '{reg_no}'. Please check and try again."
            }), 404
            
        if info.get("error") == "PHONE_MISMATCH":
            return jsonify({
                "success": False,
                "message": "The mobile number provided does not match the registered parent mobile number for this student."
            }), 401
            
        # If phone matches, generate an OTP! (Step 2 of login)
        if phone:
            otp = create_otp(reg_no)
            return jsonify({
                "success": True, 
                "student": info, 
                "otp_sent": True,
                "demo_otp": otp # For demo purposes
            })

        return jsonify({"success": True, "student": info})

    @staticmethod
    def verify_otp():
        body   = request.get_json(silent=True) or {}
        reg_no = body.get("regNo", "").strip()
        otp    = body.get("otp", "").strip()

        if not reg_no or not otp:
            return jsonify({"success": False, "message": "regNo and otp are required"}), 400

        valid = verify_user_otp(reg_no, otp)
        if not valid:
            return jsonify({"success": False, "message": "Invalid or expired OTP. Please try again."}), 401

        return jsonify({"success": True, "message": "Verification successful."})

    @staticmethod
    def chatbot_query():
        body    = request.get_json(silent=True) or {}
        reg_no  = body.get("regNo", "").strip()
        message = body.get("message", "").strip()

        if not reg_no or not message:
            return jsonify({"success": False, "message": "regNo and message are required"}), 400

        response = handle_query(reg_no, message)
        return jsonify({"success": True, **response})
