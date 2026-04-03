import pandas as pd
from .data_handler import get_student_rows
from .intent_detector import detect_intent
from .builders.attendance_builder import build_attendance_response
from .builders.performance_builder import build_performance_response
from .builders.fees_builder import build_fees_response
from .builders.status_builder import build_academic_status_response
from .builders.profile_builder import build_profile_response
from .builders.notif_builder import build_notifications_response
from .builders.support_builder import build_support_response
from .builders.insights_builder import build_insights_response
from .builders.calendar_builder import build_academic_calendar_response

def handle_query(reg_no: str, message: str) -> dict:
    rows = get_student_rows(reg_no)
    if rows.empty:
        return {
            "type": "text",
            "text": "I couldn't find any student record for the provided registration number. Please verify and try again.",
            "data": None,
        }

    intent = detect_intent(message)

    if intent == "attendance":
        return build_attendance_response(rows, message)
    elif intent == "performance":
        return build_performance_response(rows, message)
    elif intent == "fees":
        return build_fees_response(rows)
    elif intent == "profile":
        return build_profile_response(rows.iloc[0])
    elif intent == "notifications":
        return build_notifications_response(rows, message)
    elif intent == "support":
        return build_support_response(rows, message)
    elif intent == "insights":
        return build_insights_response(rows, message)
    elif intent == "academic_calendar":
        return build_academic_calendar_response(rows)
    elif intent in ["backlog", "academic_status"]:
        return build_academic_status_response(rows, message)
    
    # Default fallback
    name = rows.iloc[0]["Name"].split()[0]
    return {
        "type": "text",
        "text": (
            f"I'm your EduConnect assistant for {name}'s academic information.\n\n"
            "You can ask me about:\n"
            "• Attendance Monitoring\n"
            "• Performance & Backlogs\n"
            "• Fees & Financials\n"
            "• Exams & Notifications\n"
            "• Faculty Support\n"
            "• Performance Insights"
        ),
        "data": None,
    }
