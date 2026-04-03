def detect_intent(message: str) -> str:
    msg = message.lower()
    
    # 1. Attendance (includes semester-wise and subject-wise)
    attendance_kw = ["attendance", "present", "absent", "bunk", 
                     "हाजिरी", "उपस्थिति", "उपस्थित", "अटेंडेंस",
                     "హాజరు", "అటెండెన్స్"]
    if any(k in msg for k in attendance_kw):
        return "attendance"
        
    # 2. Performance (includes semester-wise CGPA)
    perf_kw = ["cgpa", "gpa", "grade", "mark", "score", "number", "performance", "result", "sgpa",
               "नंबर", "मार्क्स", "अंक", "रिजल्ट", "परिणाम", "सीजीपीए",
               "మార్కులు", "ఫలితాలు", "గ్రేడ్"]
    if any(k in msg for k in perf_kw):
        return "performance"
        
    # 3. Fees
    fees_kw = ["fee", "fees", "pay", "payment", "due", "balance", "amount", "finance",
               "फीस", "पैसे", "भुगतान", "बकाया",
               "ఫీజు", "డబ్బులు", "చెల్లింపు"]
    if any(k in msg for k in fees_kw):
        return "fees"
        
    # 4. Backlog
    backlog_kw = ["backlog", "fail", "ktm", "arrear", "back paper",
                  "बैकलॉग", "फेल",
                  "బ్యాక్‌లాగ్", "ఫెయిల్"]
    if any(k in msg for k in backlog_kw):
        return "backlog"

    # 5. Communication Support
    support_kw = [
        "faculty", "contact", "communication_support", "advisor", "office", "professor",
        "hod", "dean", "helpdesk", "help desk", "coordinator", "counselor", "counsellor",
        "class advisor", "class teacher", "year coordinator", "academic office",
        "फैकल्टी", "शिक्षक", "संपर्क", "सलाहकार", "ऑफिस", "अध्यापक", "डीन", "हेल्पडेस्क", "समन्वयक", "परामर्शदाता",
        "ఫ్యాకల్టీ", "ఉపాధ్యాయుడు", "సంప్రదించండి", "సలహాదారు", "ఆఫీసు", "డీన్", "హెల్ప్ డెస్క్", "కోఆర్డినేటిర్", "కౌన్సిలర్"
    ]
    if any(k in msg for k in support_kw):
        return "support"

    # For 'teacher' alone
    if "teacher" in msg:
        return "support"

    # 6. Profile
    profile_kw = ["profile", "detail", "info", "student", "who",
                  "प्रोफाइल", "डिटेल", "जानकारी", "कौन",
                  "ప్రొఫైల్", "వివరాలు"]
    if any(k in msg for k in profile_kw):
        return "profile"

    # 6. Academic Calendar
    cal_kw = [
        "academic calendar", "semester calendar", "college calendar",
        "academic schedule", "semester schedule", "event schedule", "yearly schedule",
        "अकादमिक कैलेंडर", "शैक्षणिक कैलेंडर",
        "అకడమిక్ క్యాలెండర్", "సెమిస్టర్ క్యాలెండర్"
    ]
    if any(k in msg for k in cal_kw):
        return "academic_calendar"

    # 7. Academic Notifications
    notif_kw = [
        "exam", "assignment", "deadline", "notification", "announcement", "upcoming",
        "परीक्षा", "असाइनमेंट", "घोषणा", "नोटिफिकेशन",
        "పరీక్ష", "అసైన్‌మెంట్", "ప్రకటన", "నోటిఫికేషన్"
    ]
    if any(k in msg for k in notif_kw):
        return "notifications"

    # 8. Performance Insights
    insight_kw = [
        "insight", "strong", "weak", "improvement", "suggestion",
        "मजबूत", "कमजोर", "सुझाव", "सलाह",
        "బలమైన", "బలహీనమైన", "సూచన", "సలహా"
    ]
    if any(k in msg for k in insight_kw):
        return "insights"
        
    # 9. Academic Status
    status_kw = [
        "status", "repeat", "incomplete", "completion", "progress", "course",
        "स्थिति", "दोहराया", "अधूरा", "पूरा", "प्रगति",
        "స్థితి", "మళ్ళీ", "అసంపూర్ణం", "పూర్తయింది", "పురోగతి"
    ]
    if any(k in msg for k in status_kw):
        return "academic_status"
        
    return "general"


def detect_status_sub(message: str) -> str:
    msg = message.lower()
    if "backlog" in msg or "fail" in msg:
        return "backlogs_sem"
    if "repeat" in msg or "twice" in msg:
        return "repeated"
    if "incomplete" in msg or "not finished" in msg:
        return "incomplete"
    if "completion" in msg or "progress" in msg or "long" in msg:
        return "completion"
    return "overall"


def detect_attendance_sub(message: str) -> str:
    msg = message.lower()
    if "semester" in msg or "sem" in msg or "year" in msg:
        return "semester"
    if "subject" in msg or "subject-wise" in msg or "each subject" in msg:
        return "subject"
    if "low" in msg or "alert" in msg or "below" in msg or "warning" in msg:
        return "low"
    return "overall"


def detect_performance_sub(message: str) -> str:
    msg = message.lower()
    if "semester" in msg or "sem" in msg or "sgpa" in msg:
        return "semester"
    if "subject" in msg or "marks" in msg or "subject-wise" in msg:
        return "subject"
    if "year" in msg:
        return "year"
    return "overall"


def detect_notification_sub(message: str) -> str:
    msg = message.lower()
    if "exam" in msg or "test" in msg:
        return "exams"
    if "assignment" in msg or "deadline" in msg or "homework" in msg:
        return "assignments"
    if "calendar" in msg or "holiday" in msg or "break" in msg or "event" in msg:
        return "calendar"
    return "all"


def detect_support_sub(message: str) -> str:
    msg = message.lower()
    if "faculty" in msg or "professor" in msg:
        return "faculty"
    if "teacher" in msg and "class" not in msg:
        return "faculty"
    if any(k in msg for k in ["class advisor", "class teacher", "counsellor", "counselor", "advisor"]):
        return "advisor"
    if any(k in msg for k in ["year coordinator", "academic office", "office", "hod", "dean", "helpdesk", "help desk", "coordinator"]):
        return "office"
    return "all"
