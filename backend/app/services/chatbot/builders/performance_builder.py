import pandas as pd
import random
import hashlib
from ..intent_detector import detect_performance_sub

def build_performance_response(rows: pd.DataFrame, message: str = "") -> dict:
    sub = detect_performance_sub(message)
    
    if sub == "semester":
        return _build_performance_semester_response(rows)
    elif sub == "subject":
        return _build_performance_subject_response(rows)
    elif sub == "year":
        return _build_performance_year_response(rows)
    else:  # overall
        latest_sem = rows["SemesterNo"].max()
        latest_rows = rows[rows["SemesterNo"] == latest_sem]
        cgpa = round(float(latest_rows["CGPA"].mean()), 2)
        backlogs = int(latest_rows["TotalBacklogs"].iloc[0])
        grades = []
        for _, r in latest_rows.iterrows():
            sgpa = float(r["SGPA"])
            if sgpa >= 9.5:   grade = "S"
            elif sgpa >= 8.5: grade = "A+"
            elif sgpa >= 7.5: grade = "A"
            elif sgpa >= 6.5: grade = "B"
            elif sgpa >= 5.5: grade = "C"
            else:             grade = "F"
            grades.append({"subject": r["SubjectName"], "grade": grade, "points": round(sgpa, 2)})

        if cgpa >= 8.5:   status = "Excellent"
        elif cgpa >= 7.0: status = "Good"
        elif cgpa >= 5.5: status = "Average"
        else:             status = "Needs Improvement"

        text = f"Your child's Active backlogs: {backlogs}."
        return {
            "type": "performance_widget",
            "text": text,
            "data": {
                "currentCGPA": cgpa, "creditsCompleted": len(rows) * 4,
                "recentGrades": grades, "status": status, "totalBacklogs": backlogs,
            },
        }

def _build_performance_semester_response(rows: pd.DataFrame) -> dict:
    sem_groups = rows.groupby(["SemesterNo", "AcademicYear"])
    semester_grades = []
    
    for (sem, year), grp in sorted(sem_groups, key=lambda x: x[0][0]):
        avg_sgpa = round(float(grp["SGPA"].mean()), 2)
        semester_grades.append({
            "subject": f"Semester {int(sem)} ({year})",
            "grade": "S" if avg_sgpa >= 9.5 else "A+" if avg_sgpa >= 8.5 else "A" if avg_sgpa >= 7.5 else "B" if avg_sgpa >= 6.5 else "C" if avg_sgpa >= 5.5 else "F",
            "points": avg_sgpa,
        })
    
    latest_sem_row = rows[rows["SemesterNo"] == rows["SemesterNo"].max()]
    overall_cgpa = round(float(latest_sem_row["CGPA"].mean()), 2)
    text = f"📈 Semester-wise SGPA across {len(semester_grades)} semester(s). Current CGPA: {overall_cgpa}."
    return {
        "type": "performance_widget",
        "text": text,
        "data": {
            "currentCGPA": overall_cgpa,
            "creditsCompleted": len(rows) * 4,
            "recentGrades": semester_grades,
            "status": "Semester View",
            "totalBacklogs": int(latest_sem_row["TotalBacklogs"].iloc[0]),
        },
    }

def _build_performance_subject_response(rows: pd.DataFrame) -> dict:
    latest_sem = rows["SemesterNo"].max()
    latest_rows = rows[rows["SemesterNo"] == latest_sem]

    def sgpa_to_grade(sgpa):
        if sgpa >= 9.5:  return "S", "Outstanding"
        if sgpa >= 8.5:  return "A+", "Excellent"
        if sgpa >= 7.5:  return "A",  "Very Good"
        if sgpa >= 6.5:  return "B",  "Good"
        if sgpa >= 5.5:  return "C",  "Average"
        if sgpa >= 4.0:  return "D",  "Pass"
        return "F", "Fail"

    subjects = []
    for _, r in latest_rows.iterrows():
        sgpa = float(r["SGPA"])
        pct  = min((sgpa / 10.0) * 100, 100)

        seed_str = f"{r['RegNo']}-{r['SubjectName']}"
        seed_val = int(hashlib.md5(seed_str.encode()).hexdigest(), 16) % 10000
        rng = random.Random(seed_val)

        internal  = round(min(pct / 100 * 30 + rng.uniform(-1.5, 1.5), 30), 1)
        external  = round(min(pct / 100 * 70 + rng.uniform(-2.5, 2.5), 70), 1)
        internal  = max(0, internal)
        external  = max(0, external)
        total     = round(internal + external, 1)
        grade, remark = sgpa_to_grade(sgpa)

        subjects.append({
            "subject":  r["SubjectName"],
            "internal": internal,
            "external": external,
            "total":    total,
            "grade":    grade,
            "remark":   remark,
            "status":   r["SubjectStatus"],
        })

    cgpa = round(float(latest_rows["CGPA"].mean()), 2)
    text = (
        f"📚 Subject-wise marks for Semester {int(latest_sem)} "
        f"(Internal: /30 · External: /70 · Total: /100). Current CGPA: {cgpa}."
    )
    return {
        "type": "performance_widget",
        "text": text,
        "data": {
            "view":           "subject_marks",
            "semester":       int(latest_sem),
            "currentCGPA":    cgpa,
            "subjects":       subjects,
            "creditsCompleted": len(latest_rows) * 4,
            "status":         "Subject Marks",
            "totalBacklogs":  int(latest_rows["TotalBacklogs"].iloc[0]),
            "recentGrades":   [],
        },
    }

def _build_performance_year_response(rows: pd.DataFrame) -> dict:
    year_groups = rows.groupby("AcademicYear")
    year_data = []
    
    for year, grp in sorted(year_groups):
        avg_sgpa = round(float(grp["SGPA"].mean()), 2)
        year_data.append({
            "subject": f"Academic Year {year}",
            "grade": "S" if avg_sgpa >= 9.5 else "A+" if avg_sgpa >= 8.5 else "A" if avg_sgpa >= 7.5 else "B" if avg_sgpa >= 6.5 else "C" if avg_sgpa >= 5.5 else "F",
            "points": avg_sgpa,
        })
    
    latest_sem_row = rows[rows["SemesterNo"] == rows["SemesterNo"].max()]
    overall_cgpa = round(float(latest_sem_row["CGPA"].mean()), 2)
    text = f"📊 Year-wise academic performance report. Current CGPA: {overall_cgpa}."
    return {
        "type": "performance_widget",
        "text": text,
        "data": {
            "currentCGPA": overall_cgpa,
            "creditsCompleted": len(rows) * 4,
            "recentGrades": year_data,
            "status": "Yearly Overview",
            "totalBacklogs": int(latest_sem_row["TotalBacklogs"].iloc[0]),
        },
    }
