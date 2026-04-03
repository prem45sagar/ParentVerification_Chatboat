import pandas as pd
from ..intent_detector import detect_notification_sub

def build_notifications_response(rows: pd.DataFrame, message: str = "") -> dict:
    sub = detect_notification_sub(message)
    exams = [{"name": "Mid-Term Examination", "date": "15 Apr 2026"}, {"name": "Lab Practicals", "date": "22 Apr 2026"}]
    assignments = [{"name": "Database Management Project", "deadline": "12 Apr 2026"}, {"name": "Network Security Case Study", "deadline": "18 Apr 2026"}]
    calendar = "Spring Break scheduled from May 1 to May 7. Regular classes resume May 8."

    if sub == "exams": assignments, calendar, text = [], None, "📖 Upcoming exams."
    elif sub == "assignments": exams, calendar, text = [], None, "📝 Latest assignment deadlines."
    elif sub == "calendar": exams, assignments, text = [], [], "📅 Academic calendar updates."
    else: text = "🔔 Latest academic notifications."

    return {
        "type": "notifications_widget",
        "text": text,
        "data": {"upcomingExams": exams, "assignments": assignments, "calendarUpdates": calendar}
    }
