"""
generate_dataset.py
Generates a realistic academic Excel dataset with:
 - Multi-semester data (up to 6 semesters)
 - Subject-wise status: Completed, Backlog, Repeated, Incomplete
 - Semester-wise backlog tracking
 - Progress tracking
"""

import pandas as pd
import numpy as np
import random

random.seed(42)
np.random.seed(42)

# ─── Configuration ─────────────────────────────────────────────────────────────

STUDENTS = [
    {"RegNo": "22CS001", "Name": "Student_1",  "Gender": "Male",   "Dept": "Computer Science", "Program": "B.Tech", "Section": "A", "AdmissionYear": 2022, "ParentContactNo": 9905487157, "BatchStart": 2022, "BatchEnd": 2026},
    {"RegNo": "22CS002", "Name": "Student_2",  "Gender": "Female", "Dept": "Computer Science", "Program": "B.Tech", "Section": "A", "AdmissionYear": 2022, "ParentContactNo": 9199794238, "BatchStart": 2022, "BatchEnd": 2026},
    {"RegNo": "22CS003", "Name": "Student_3",  "Gender": "Male",   "Dept": "Computer Science", "Program": "B.Tech", "Section": "B", "AdmissionYear": 2022, "ParentContactNo": 9608808638, "BatchStart": 2022, "BatchEnd": 2026},
    {"RegNo": "22CS004", "Name": "Student_4",  "Gender": "Female", "Dept": "Computer Science", "Program": "B.Tech", "Section": "B", "AdmissionYear": 2022, "ParentContactNo": 6207616747, "BatchStart": 2022, "BatchEnd": 2026},
    {"RegNo": "22CS005", "Name": "Student_5",  "Gender": "Male",   "Dept": "Computer Science", "Program": "B.Tech", "Section": "A", "AdmissionYear": 2022, "ParentContactNo": 7480075443, "BatchStart": 2022, "BatchEnd": 2026},
    {"RegNo": "22EC001", "Name": "Student_6",  "Gender": "Female", "Dept": "Electronics",      "Program": "B.Tech", "Section": "A", "AdmissionYear": 2022, "ParentContactNo": 9523641780, "BatchStart": 2022, "BatchEnd": 2026},
    {"RegNo": "22EC002", "Name": "Student_7",  "Gender": "Male",   "Dept": "Electronics",      "Program": "B.Tech", "Section": "A", "AdmissionYear": 2022, "ParentContactNo": 9418523670, "BatchStart": 2022, "BatchEnd": 2026},
    {"RegNo": "22ME001", "Name": "Student_8",  "Gender": "Female", "Dept": "Mechanical",       "Program": "B.Tech", "Section": "A", "AdmissionYear": 2022, "ParentContactNo": 9317625410, "BatchStart": 2022, "BatchEnd": 2026},
    {"RegNo": "22ME002", "Name": "Student_9",  "Gender": "Male",   "Dept": "Mechanical",       "Program": "B.Tech", "Section": "B", "AdmissionYear": 2022, "ParentContactNo": 9216743580, "BatchStart": 2022, "BatchEnd": 2026},
    {"RegNo": "22CE001", "Name": "Student_10", "Gender": "Female", "Dept": "Civil Engineering","Program": "B.Tech", "Section": "A", "AdmissionYear": 2022, "ParentContactNo": 9105862470, "BatchStart": 2022, "BatchEnd": 2026},
]

SUBJECTS_BY_SEMESTER = {
    1: ["Engineering Mathematics",     "Engineering Physics",         "Programming in C",          "Engineering Drawing",         "Communication Skills"],
    2: ["Applied Mathematics",         "Engineering Chemistry",       "Data Structures",           "Digital Electronics",         "Environmental Science"],
    3: ["Discrete Mathematics",        "Computer Organization",       "Object Oriented Programming","Operating Systems",           "Database Systems"],
    4: ["Analysis & Design of Algorithms", "Software Engineering",   "Computer Networks",         "Microprocessors",             "Web Technologies"],
    5: ["Artificial Intelligence",     "Machine Learning",            "Cloud Computing",           "Cyber Security",              "Mobile App Development"],
    6: ["Big Data Analytics",          "Deep Learning",               "Distributed Systems",       "Project Management",          "Open Elective I"],
}

SEM_TO_YEAR = {1: "2022-23", 2: "2022-23", 3: "2023-24", 4: "2023-24", 5: "2024-25", 6: "2024-25"}

STUDENT_CURRENT_SEM = {
    "22CS001": 4, "22CS002": 6, "22CS003": 5, "22CS004": 6,
    "22CS005": 3, "22EC001": 6, "22EC002": 5, "22ME001": 4,
    "22ME002": 6, "22CE001": 3,
}

STUDENT_TREND = {
    "22CS001": "average", "22CS002": "excellent", "22CS003": "good",
    "22CS004": "excellent", "22CS005": "poor",     "22EC001": "good",
    "22EC002": "average",  "22ME001": "good",      "22ME002": "excellent",
    "22CE001": "average",
}

def generate_profile_details(trend="average"):
    if trend == "excellent":
        att = random.randint(85, 100)
        sgpa = round(random.uniform(8.5, 10.0), 2)
    elif trend == "good":
        att = random.randint(75, 90)
        sgpa = round(random.uniform(7.0, 8.8), 2)
    elif trend == "average":
        att = random.randint(65, 85)
        sgpa = round(random.uniform(5.5, 7.5), 2)
    else:  # poor
        att = random.randint(40, 70)
        sgpa = round(random.uniform(4.0, 6.0), 2)
    return att, sgpa

# ─── Build rows ────────────────────────────────────────────────────────────────
rows = []

for s in STUDENTS:
    reg = s["RegNo"]
    max_sem = STUDENT_CURRENT_SEM[reg]
    trend = STUDENT_TREND[reg]
    
    total_fee = random.choice([60000, 75000, 90000])
    paid_fee = random.randint(int(total_fee * 0.5), total_fee)
    due_fee = total_fee - paid_fee
    
    all_sgpas = []
    student_backlogs = {} # sem -> list of subjects
    student_repeated = [] 
    student_incomplete = []

    for sem in range(1, max_sem + 1):
        academic_year = SEM_TO_YEAR[sem]
        subjects = SUBJECTS_BY_SEMESTER[sem]
        
        # Add repeated subjects from previous backlogs (randomly)
        current_subjects = list(subjects)
        backlog_keys = list(student_backlogs.keys())
        for bsem in backlog_keys:
            if bsem < sem:
                # 50% chance to repeat a backlog in a later semester
                for bsubj in student_backlogs[bsem]:
                    if random.random() > 0.5 and bsubj not in student_repeated:
                        current_subjects.append(bsubj)
                        student_repeated.append(bsubj)

        for subj in current_subjects:
            att, sgpa = generate_profile_details(trend)
            is_repeat = subj in student_repeated and subj not in subjects
            
            # Determine status
            if sgpa < 5.0:
                status = "Backlog"
                if sem not in student_backlogs: student_backlogs[sem] = []
                student_backlogs[sem].append(subj)
            elif att < 40:
                status = "Incomplete"
                student_incomplete.append(subj)
            elif is_repeat:
                status = "Repeated"
            else:
                status = "Completed"

            all_sgpas.append(sgpa)
            
            rows.append({
                "RegNo":                s["RegNo"],
                "Name":                 s["Name"],
                "Gender":               s["Gender"],
                "Section":              s["Section"],
                "ParentContactNo":      s["ParentContactNo"],
                "AdmissionYear":        s["AdmissionYear"],
                "Department":           s["Dept"],
                "Program":              s["Program"],
                "BatchStart":           s["BatchStart"],
                "BatchEnd":             s["BatchEnd"],
                "SemesterNo":           sem,
                "AcademicYear":         academic_year,
                "SubjectCode":          f"{reg[:2]}{sem:02d}{random.randint(10,99)}",
                "SubjectName":          subj,
                "Credits":              4,
                "TotalClasses":         60,
                "AttendedClasses":      round(60 * att / 100),
                "AttendancePercentage": att,
                "SGPA":                 sgpa,
                "CGPA":                 round(sum(all_sgpas) / len(all_sgpas), 2),
                "TotalBacklogs":        sum(len(v) for v in student_backlogs.values()),
                "SubjectStatus":        status,
                "TotalFee":             total_fee,
                "PaidFee":              paid_fee,
                "DueFee":               due_fee,
                "PaymentStatus":        "PAID" if due_fee == 0 else "PENDING",
                "CourseCompletionPct":  round((max_sem / 8) * 100, 1)
            })

df = pd.DataFrame(rows)
df.to_excel("../data/academic_dataset.xlsx", index=False)
print("✅ Expanded dataset generated with Academic Status fields.")
