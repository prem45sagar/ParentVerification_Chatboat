import pandas as pd

def build_insights_response(rows: pd.DataFrame, message: str = "") -> dict:
    msg = message.lower()
    strong_kw = ["strong", "best", "मजबूत", "బలమైన"]
    weak_kw = ["weak", "improve", "improvement", "कमजोर", "బలహీనమైన"]
    
    show_strong, show_weak = True, True
    has_strong, has_weak = any(k in msg for k in strong_kw), any(k in msg for k in weak_kw)
    
    if has_strong and not has_weak: show_weak = False
    elif has_weak and not has_strong: show_strong = False

    latest_sem = rows["SemesterNo"].max()
    latest_rows = rows[rows["SemesterNo"] == latest_sem]
    df_sorted = latest_rows.sort_values(by='SGPA', ascending=False)
    
    n = len(df_sorted)
    if n >= 4:
        strong = df_sorted.head(2)['SubjectName'].tolist()
        weak = df_sorted.tail(2)['SubjectName'].tolist()
    elif n >= 2:
        strong = df_sorted.head(1)['SubjectName'].tolist()
        weak = df_sorted.tail(1)['SubjectName'].tolist()
    else:
        strong = df_sorted['SubjectName'].tolist()
        weak = []

    text = f"Academic analysis (Semester {int(latest_sem)})."
    return {
        "type": "insights_widget",
        "text": text,
        "data": {"showStrong": show_strong, "showWeak": show_weak, "strongSubjects": strong, "weakSubjects": weak}
    }
