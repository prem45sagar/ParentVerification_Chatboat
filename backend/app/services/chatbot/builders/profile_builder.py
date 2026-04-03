import pandas as pd

def build_profile_response(row0: pd.Series) -> dict:
    text = (
        f"📋 Student Profile\n\n"
        f"• Name: {row0['Name']}\n"
        f"• Reg No: {row0['RegNo']}\n"
        f"• Department: {row0['Department']}\n"
        f"• Program: {row0['Program']}\n"
        f"• Section: {row0['Section']}\n"
        f"• Academic Year: {row0['AcademicYear']}"
    )
    return {"type": "text", "text": text, "data": None}
