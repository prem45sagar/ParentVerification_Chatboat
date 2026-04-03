import pandas as pd
from ..intent_detector import detect_status_sub

def build_academic_status_response(rows: pd.DataFrame, message: str = "") -> dict:
    sub = detect_status_sub(message)
    
    if sub == "backlogs_sem":
        return _build_backlogs_semester_wise_report(rows)
    elif sub == "repeated":
        return _build_repeated_subjects_report(rows)
    elif sub == "incomplete":
        return _build_incomplete_subjects_report(rows)
    elif sub == "completion":
        return _build_course_completion_report(rows)
    else:
        latest_sem = rows["SemesterNo"].max()
        backlogs = int(rows[rows["SemesterNo"] == latest_sem]["TotalBacklogs"].iloc[0])
        if backlogs == 0:
            text = "✅ Your child currently has no active backlogs."
        else:
            text = f"⚠️ Your child has {backlogs} active backlog(s)."
        return {"type": "text", "text": text, "data": None}

def _build_backlogs_semester_wise_report(rows: pd.DataFrame) -> dict:
    backlog_data = rows[rows["SubjectStatus"] == "Backlog"]
    if backlog_data.empty:
        return {"type": "text", "text": "✅ Good news! There are no backlogs recorded in any semester.", "data": None}
    
    sem_groups = backlog_data.groupby("SemesterNo")
    report = "📋 **Semester-wise Backlog Report**\n\n"
    for sem, grp in sorted(sem_groups):
        subjects = grp["SubjectName"].tolist()
        report += f"• **Semester {int(sem)}**: {', '.join(subjects)}\n"
    
    total = len(backlog_data)
    report += f"\n**Total Backlogs across all semesters: {total}**"
    
    return {"type": "text", "text": report, "data": None}

def _build_repeated_subjects_report(rows: pd.DataFrame) -> dict:
    repeated_data = rows[rows["SubjectStatus"] == "Repeated"]
    if repeated_data.empty:
        return {"type": "text", "text": "No subjects are currently being repeated.", "data": None}
    
    subjects = repeated_data["SubjectName"].unique().tolist()
    text = f"🔄 **Repeated Subjects**\n\nYour child is repeating the following subjects:\n" + "\n".join([f"• {s}" for s in subjects])
    return {"type": "text", "text": text, "data": None}

def _build_incomplete_subjects_report(rows: pd.DataFrame) -> dict:
    incomplete_data = rows[rows["SubjectStatus"] == "Incomplete"]
    if incomplete_data.empty:
        return {"type": "text", "text": "All registered subjects are marked as completed or in-progress. No 'Incomplete' status found.", "data": None}
    
    subjects = incomplete_data["SubjectName"].unique().tolist()
    text = f"⏳ **Incomplete Subjects**\n\nThe following subjects are marked as incomplete:\n" + "\n".join([f"• {s}" for s in subjects])
    return {"type": "text", "text": text, "data": None}

def _build_course_completion_report(rows: pd.DataFrame) -> dict:
    latest_row = rows.iloc[-1]
    progress = latest_row.get("CourseCompletionPct", 0)
    current_sem = latest_row["SemesterNo"]
    
    text = (
        f"🎓 Course Completion Status\n\n"
        f"• Current Progress: {progress}%\n"
        f"• Semesters Completed: {int(current_sem)} out of 8\n"
        f"• Graduation Year: {latest_row['BatchEnd']}\n\n"
        f"Your child is on track for graduation in {latest_row['BatchEnd']}."
    )
    return {"type": "text", "text": text, "data": None}
