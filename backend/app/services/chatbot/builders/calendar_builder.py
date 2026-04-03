import pandas as pd
from datetime import date as _date

def build_academic_calendar_response(rows: pd.DataFrame) -> dict:
    today = _date.today()
    upcoming_count = 0
    next_event = None

    CALENDAR_EVENTS = [
        {"date": "2026-03-26", "label": "Holiday – Srirama Navami",       "type": "holiday"},
        {"date": "2026-04-01", "label": "M2 Target 1",                      "type": "exam"},
        {"date": "2026-04-02", "label": "M2 Target 1",                      "type": "exam"},
        {"date": "2026-04-03", "label": "Holiday – Good Friday",            "type": "holiday"},
        {"date": "2026-04-04", "label": "M2 Target 1",                      "type": "exam"},
        {"date": "2026-04-05", "label": "Holiday – Dr. Babu Jagjivan Ram Jayanthi", "type": "holiday"},
        {"date": "2026-04-14", "label": "Holiday – Ambedkar Jayanthi",      "type": "holiday"},
        {"date": "2026-04-17", "label": "M1 Target 3",                      "type": "exam"},
        {"date": "2026-04-18", "label": "M2 Target 3",                      "type": "exam"},
        {"date": "2026-04-20", "label": "M2 Target 4",                      "type": "exam"},
        {"date": "2026-04-21", "label": "M2 Target 4",                      "type": "exam"},
        {"date": "2026-04-22", "label": "M2 Target 4",                      "type": "exam"},
        {"date": "2026-04-23", "label": "Preparation & Summative Assessment (P-Based)", "type": "assessment"},
        {"date": "2026-04-24", "label": "Preparation & Summative Assessment (P-Based)", "type": "assessment"},
        {"date": "2026-04-25", "label": "Preparation & Summative Assessment (P-Based)", "type": "assessment"},
        {"date": "2026-04-27", "label": "Preparation & Summative Assessment (P-Based)", "type": "assessment"},
        {"date": "2026-04-28", "label": "Preparation & Summative Assessment (P-Based)", "type": "assessment"},
        {"date": "2026-04-29", "label": "Preparation & Summative Assessment (P-Based)", "type": "assessment"},
        {"date": "2026-04-30", "label": "Summative Assessment (L-Based)",   "type": "assessment"},
        {"date": "2026-05-27", "label": "Holiday – Bakrid",                 "type": "holiday"},
    ]

    for ev in CALENDAR_EVENTS:
        ev_date = _date.fromisoformat(ev["date"])
        delta = (ev_date - today).days
        if 0 <= delta <= 60:
            upcoming_count += 1
            if next_event is None: next_event = ev

    if next_event:
        delta_days = (_date.fromisoformat(next_event["date"]) - today).days
        when = "today" if delta_days == 0 else "tomorrow" if delta_days == 1 else f"in {delta_days} days"
        text = f"📅 Academic Calendar for Semester II (2025-26).\nNext: **{next_event['label']}** — {when}."
    else:
        text = "📅 Academic Calendar for Semester II (2025-26). No events soon."

    return {
        "type": "calendar_widget",
        "text": text,
        "data": {"semester": "II", "academicYear": "2025-26", "institution": "Vignan's FSTR Vadlamudi"}
    }
