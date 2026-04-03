import pandas as pd
from ..intent_detector import detect_attendance_sub

def build_attendance_response(rows: pd.DataFrame, message: str = "") -> dict:
    sub = detect_attendance_sub(message)
    
    if sub == "semester":
        return _build_attendance_semester_response(rows)
    elif sub == "subject":
        return _build_attendance_subject_response(rows)
    elif sub == "low":
        return _build_attendance_low_response(rows)
    else:  # overall
        latest_sem = rows["SemesterNo"].max()
        latest_rows = rows[rows["SemesterNo"] == latest_sem]
        overall = round(float(latest_rows["AttendancePercentage"].mean()), 1)
        notice = f"Your child's overall attendance is {overall}% (Semester {int(latest_sem)})."
        if overall < 75:
            notice += " This is below the required 75% threshold."
        return {
            "type": "attendance_widget",
            "text": notice,
            "data": {"overall": overall, "notice": notice},
        }

def _build_attendance_semester_response(rows: pd.DataFrame) -> dict:
    sem_groups = rows.groupby(["SemesterNo", "AcademicYear"])
    semester_data = []
    
    for (sem, year), grp in sorted(sem_groups, key=lambda x: x[0][0]):
        avg_att = round(float(grp["AttendancePercentage"].mean()), 1)
        warning = avg_att < 75
        semester_data.append({
            "name": f"Semester {int(sem)} ({year})",
            "current": avg_att,
            "required": 75,
            "warning": warning,
        })
    
    text = f"📅 Semester-wise attendance report across {len(semester_data)} semester(s)."
    return {
        "type": "attendance_widget",
        "text": text,
        "data": {
            "overall": round(float(rows["AttendancePercentage"].mean()), 1),
            "notice": text,
            "subjects": semester_data,
        },
    }

def _build_attendance_subject_response(rows: pd.DataFrame) -> dict:
    latest_sem = rows["SemesterNo"].max()
    latest_rows = rows[rows["SemesterNo"] == latest_sem]
    overall = round(float(latest_rows["AttendancePercentage"].mean()), 1)
    subjects = []
    for _, r in latest_rows.iterrows():
        pct = round(float(r["AttendancePercentage"]), 1)
        subjects.append({
            "name": r["SubjectName"],
            "current": pct,
            "required": 75,
            "warning": pct < 75,
        })
    return {
        "type": "attendance_widget",
        "text": f"Subject-wise attendance for Semester {int(latest_sem)}.",
        "data": {
            "overall": overall,
            "subjects": subjects
        },
    }

def _build_attendance_low_response(rows: pd.DataFrame) -> dict:
    latest_sem = rows["SemesterNo"].max()
    latest_rows = rows[rows["SemesterNo"] == latest_sem]
    overall = round(float(latest_rows["AttendancePercentage"].mean()), 1)
    subjects = []
    for _, r in latest_rows.iterrows():
        pct = round(float(r["AttendancePercentage"]), 1)
        if pct < 75:
            subjects.append({
                "name": r["SubjectName"],
                "current": pct,
                "required": 75,
                "warning": True,
            })
    
    if subjects:
        notice = f"⚠️ Low attendance alerts for Semester {int(latest_sem)}: " + ", ".join(s["name"] for s in subjects) + "."
    else:
        notice = f"✅ Great! No low attendance alerts for Semester {int(latest_sem)}. All subjects are above 75%."

    return {
        "type": "attendance_widget",
        "text": notice,
        "data": {
            "overall": overall,
            "subjects": subjects,
            "notice": notice
        },
    }
