import pandas as pd
from ..intent_detector import detect_support_sub

def build_support_response(rows: pd.DataFrame, message: str = "") -> dict:
    row = rows.iloc[0]
    dept = row["Department"]
    section = row["Section"]
    sub = detect_support_sub(message)

    # ─── Subject → Faculty mapping ─────────────────────
    SUBJECT_FACULTY_MAP = {
        "Engineering Mathematics":   {"name": "Dr. Anjali Verma",      "phone": "+91 98452 10001", "email": "a.verma@educonnect.edu"},
        "Engineering Physics":        {"name": "Prof. Ramesh Nair",     "phone": "+91 98452 10002", "email": "r.nair@educonnect.edu"},
        "Programming in C":           {"name": "Dr. Priya Sharma",      "phone": "+91 98452 10003", "email": "p.sharma@educonnect.edu"},
        "Engineering Drawing":        {"name": "Mr. Suresh Kumar",      "phone": "+91 98452 10004", "email": "s.kumar@educonnect.edu"},
        "Communication Skills":       {"name": "Ms. Deepa Iyer",        "phone": "+91 98452 10005", "email": "d.iyer@educonnect.edu"},
        "Applied Mathematics":        {"name": "Dr. Kavitha Menon",     "phone": "+91 98452 10006", "email": "k.menon@educonnect.edu"},
        "Engineering Chemistry":      {"name": "Prof. Arjun Pillai",    "phone": "+91 98452 10007", "email": "a.pillai@educonnect.edu"},
        "Data Structures":            {"name": "Dr. Sanjay Gupta",      "phone": "+91 98452 10008", "email": "s.gupta@educonnect.edu"},
        "Digital Electronics":        {"name": "Ms. Nithya Raj",        "phone": "+91 98452 10009", "email": "n.raj@educonnect.edu"},
        "Environmental Science":      {"name": "Mr. Venkat Subramanian","phone": "+91 98452 10010", "email": "v.subramanian@educonnect.edu"},
        "Discrete Mathematics":       {"name": "Dr. Lakshmi Prasad",   "phone": "+91 98452 10011", "email": "l.prasad@educonnect.edu"},
        "Computer Organization":      {"name": "Prof. Anil Mehta",      "phone": "+91 98452 10012", "email": "a.mehta@educonnect.edu"},
        "Object Oriented Programming":{"name": "Dr. Ritu Singh",        "phone": "+91 98452 10013", "email": "r.singh@educonnect.edu"},
        "Operating Systems":          {"name": "Mr. Vijay Krishnan",    "phone": "+91 98452 10014", "email": "v.krishnan@educonnect.edu"},
        "Database Systems":           {"name": "Ms. Pooja Reddy",       "phone": "+91 98452 10015", "email": "p.reddy@educonnect.edu"},
        "Analysis & Design of Algorithms": {"name": "Dr. Harish Bose",  "phone": "+91 98452 10016", "email": "h.bose@educonnect.edu"},
        "Software Engineering":       {"name": "Prof. Meena Chandran",  "phone": "+91 98452 10017", "email": "m.chandran@educonnect.edu"},
        "Computer Networks":          {"name": "Dr. Sunil Mathew",      "phone": "+91 98452 10018", "email": "s.mathew@educonnect.edu"},
        "Microprocessors":            {"name": "Mr. Rajesh Patel",      "phone": "+91 98452 10019", "email": "r.patel@educonnect.edu"},
        "Web Technologies":           {"name": "Ms. Ananya Das",        "phone": "+91 98452 10020", "email": "a.das@educonnect.edu"},
        "Artificial Intelligence":    {"name": "Dr. Kiran Rao",         "phone": "+91 98452 10021", "email": "k.rao@educonnect.edu"},
        "Machine Learning":           {"name": "Prof. Divya Nambiar",   "phone": "+91 98452 10022", "email": "d.nambiar@educonnect.edu"},
        "Cloud Computing":            {"name": "Dr. Ashwin Joshi",      "phone": "+91 98452 10023", "email": "a.joshi@educonnect.edu"},
        "Cyber Security":             {"name": "Mr. Manoj Tiwari",      "phone": "+91 98452 10024", "email": "m.tiwari@educonnect.edu"},
        "Mobile App Development":     {"name": "Ms. Sneha Kulkarni",    "phone": "+91 98452 10025", "email": "s.kulkarni@educonnect.edu"},
        "Big Data Analytics":         {"name": "Dr. Prakash Menon",     "phone": "+91 98452 10026", "email": "p.menon@educonnect.edu"},
        "Deep Learning":              {"name": "Prof. Geetha Suresh",   "phone": "+91 98452 10027", "email": "g.suresh@educonnect.edu"},
        "Distributed Systems":        {"name": "Dr. Naresh Babu",       "phone": "+91 98452 10028", "email": "n. बाबू@educonnect.edu"},
        "Project Management":         {"name": "Mr. Santosh Ghosh",     "phone": "+91 98452 10029", "email": "s.ghosh@educonnect.edu"},
        "Open Elective I":            {"name": "Ms. Lalitha Devi",      "phone": "+91 98452 10030", "email": "l.devi@educonnect.edu"},
    }

    ADVISOR_MAP = {
        ("Computer Science",   "A"): {"name": "Dr. Priya Sharma",    "phone": "+91 91234 56701", "email": "p.sharma@educonnect.edu",    "role": "Section A Class Advisor & Counsellor – CSE"},
        ("Computer Science",   "B"): {"name": "Dr. Sanjay Gupta",    "phone": "+91 91234 56702", "email": "s.gupta@educonnect.edu",     "role": "Section B Class Advisor & Counsellor – CSE"},
        ("Electronics",        "A"): {"name": "Ms. Nithya Raj",      "phone": "+91 91234 56703", "email": "n.raj@educonnect.edu",       "role": "Section A Class Advisor & Counsellor – ECE"},
        ("Electronics",        "B"): {"name": "Prof. Anil Mehta",    "phone": "+91 91234 56704", "email": "a.mehta@educonnect.edu",     "role": "Section B Class Advisor & Counsellor – ECE"},
        ("Mechanical",         "A"): {"name": "Prof. Meena Chandran","phone": "+91 91234 56705", "email": "m.chandran@educonnect.edu",  "role": "Section A Class Advisor & Counsellor – Mech"},
        ("Mechanical",         "B"): {"name": "Mr. Santosh Ghosh",   "phone": "+91 91234 56706", "email": "s.ghosh@educonnect.edu",     "role": "Section B Class Advisor & Counsellor – Mech"},
        ("Civil Engineering",  "A"): {"name": "Dr. Kavitha Menon",   "phone": "+91 91234 56707", "email": "k.menon@educonnect.edu",     "role": "Section A Class Advisor & Counsellor – Civil"},
        ("Civil Engineering",  "B"): {"name": "Mr. Suresh Kumar",    "phone": "+91 91234 56708", "email": "s.kumar@educonnect.edu",     "role": "Section B Class Advisor & Counsellor – Civil"},
    }

    OFFICE_MAP = {
        "Computer Science": {
            "hod":         {"name": "Dr. Ramesh Nair",        "phone": "+91 44 2345 6101", "email": "hod.cse@educonnect.edu"},
            "coordinator": {"name": "Prof. Divya Nambiar",    "phone": "+91 44 2345 6102", "email": "coordinator.cse@educonnect.edu"},
            "dean":        {"name": "Dr. Arthur Pendragon",   "phone": "+91 44 2345 6001", "email": "dean@educonnect.edu"},
            "helpdesk":    {"phone": "1800-555-0101",          "email": "support.cse@educonnect.edu"},
        },
        "Electronics": {
            "hod":         {"name": "Dr. Sunil Mathew",       "phone": "+91 44 2345 6201", "email": "hod.ece@educonnect.edu"},
            "coordinator": {"name": "Mr. Venkat Subramanian", "phone": "+91 44 2345 6202", "email": "coordinator.ece@educonnect.edu"},
            "dean":        {"name": "Dr. Arthur Pendragon",   "phone": "+91 44 2345 6001", "email": "dean@educonnect.edu"},
            "helpdesk":    {"phone": "1800-555-0201",          "email": "support.ece@educonnect.edu"},
        },
        "Mechanical": {
            "hod":         {"name": "Dr. Harish Bose",        "phone": "+91 44 2345 6301", "email": "hod.mech@educonnect.edu"},
            "coordinator": {"name": "Ms. Lalitha Devi",       "phone": "+91 44 2345 6302", "email": "coordinator.mech@educonnect.edu"},
            "dean":        {"name": "Dr. Arthur Pendragon",   "phone": "+91 44 2345 6001", "email": "dean@educonnect.edu"},
            "helpdesk":    {"phone": "1800-555-0301",          "email": "support.mech@educonnect.edu"},
        },
        "Civil Engineering": {
            "hod":         {"name": "Dr. Arjun Pillai",       "phone": "+91 44 2345 6401", "email": "hod.civil@educonnect.edu"},
            "coordinator": {"name": "Ms. Deepa Iyer",         "phone": "+91 44 2345 6402", "email": "coordinator.civil@educonnect.edu"},
            "dean":        {"name": "Dr. Arthur Pendragon",   "phone": "+91 44 2345 6001", "email": "dean@educonnect.edu"},
            "helpdesk":    {"phone": "1800-555-0401",          "email": "support.civil@educonnect.edu"},
        },
    }

    latest_sem = rows["SemesterNo"].max()
    latest_rows = rows[rows["SemesterNo"] == latest_sem]

    faculties = []
    seen_subjects = set()
    for _, r in latest_rows.iterrows():
        subj = r["SubjectName"]
        if subj in seen_subjects: continue
        seen_subjects.add(subj)
        f = SUBJECT_FACULTY_MAP.get(subj, {"name": "TBD", "phone": "N/A", "email": "support@educonnect.edu"})
        faculties.append({"subject": subj, "name": f["name"], "phone": f["phone"], "email": f["email"]})

    advisor = ADVISOR_MAP.get((dept, section), {"name": "Office", "phone": "N/A", "email": "office@educonnect.edu", "role": "Advisor"})
    office = OFFICE_MAP.get(dept, OFFICE_MAP["Computer Science"])

    if sub == "faculty": text = f"📚 Faculty contacts for Semester {int(latest_sem)} ({dept})."
    elif sub == "advisor": text = f"🧑‍🏫 Class Advisor for {dept} – Section {section}."
    elif sub == "office": text = f"🏛️ Academic Office for {dept}."
    else: text = f"📞 Communication support for {dept} – Section {section}."

    return {
        "type": "support_widget",
        "text": text,
        "data": {"view": sub, "faculties": faculties, "advisor": advisor, "office": office, "department": dept, "section": section}
    }
