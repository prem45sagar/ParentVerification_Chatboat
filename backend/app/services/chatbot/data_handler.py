import pandas as pd
import numpy as np
from app.config.config import Config

_EXCEL_PATH = Config.DATASET_PATH

def _load_data():
    """Load and clean the dataset exactly as in the Colab notebook."""
    try:
        df = pd.read_excel(_EXCEL_PATH)
    except FileNotFoundError:
        print("[chatbot_engine] WARNING: Dataset file not found. Run generate_dataset.py first.")
        return pd.DataFrame()

    # String cleaning
    df["Gender"]        = df["Gender"].str.strip().str.title()
    df["Department"]    = df["Department"].str.strip().str.title()
    df["PaymentStatus"] = df["PaymentStatus"].str.strip().str.upper()

    # Handle missing values (pandas 2.x Copy-on-Write compatible)
    num_cols = df.select_dtypes(include=["int64", "float64"]).columns
    for col in num_cols:
        df[col] = df[col].fillna(df[col].median())

    cat_cols = df.select_dtypes(include=["object"]).columns
    for col in cat_cols:
        df[col] = df[col].fillna(df[col].mode()[0])

    # Feature engineering
    df["DueFee"] = df["TotalFee"] - df["PaidFee"]
    df["PaymentStatus"] = df["PaymentStatus"].where(df["DueFee"] != 0, "PAID")

    # Outlier clipping (IQR)
    for col in num_cols:
        Q1, Q3 = df[col].quantile(0.25), df[col].quantile(0.75)
        IQR = Q3 - Q1
        df[col] = np.clip(df[col], Q1 - 1.5 * IQR, Q3 + 1.5 * IQR)

    # Risk flags (same as Colab)
    df["BacklogRisk"]    = (df["TotalBacklogs"] > 0).astype(int)
    df["LowAttendance"]  = (df["AttendancePercentage"] < 75).astype(int)
    df["FeeDefaulter"]   = (df["DueFee"] > 0).astype(int)

    return df

# Initialize shared dataframe
_df = _load_data()
if not _df.empty:
    print(f"[chatbot_engine] Dataset loaded: {len(_df)} rows, {_df['RegNo'].nunique()} students.")

def get_student_rows(reg_no: str) -> pd.DataFrame:
    """Return all DataFrame rows for a given RegNo (case-insensitive)."""
    if _df.empty:
        return pd.DataFrame()
    return _df[_df["RegNo"].str.upper() == reg_no.strip().upper()]

def get_student_info(reg_no: str, phone: str = None) -> dict | None:
    """
    Return basic student profile or None if not found or phone mismatch.
    If phone is provided, it must match ParentContactNo.
    """
    rows = get_student_rows(reg_no)
    if rows.empty:
        return None
        
    row = rows.iloc[0]
    
    # Validate phone if provided
    if phone:
        # Clean both input phone and dataset phone to basic digits for solid comparison
        input_phone = ''.join(filter(str.isdigit, phone))
        db_phone = ''.join(filter(str.isdigit, str(row.get("ParentContactNo", ""))))
        
        # If the dataset has a valid phone and it doesn't match the last 10 digits
        if db_phone and input_phone[-10:] != db_phone[-10:]:
            return {"error": "PHONE_MISMATCH"}

    return {
        "regNo":      row["RegNo"],
        "name":       row["Name"],
        "gender":     row["Gender"],
        "department": row["Department"],
        "program":    row["Program"],
        "section":    row["Section"],
        "year":       row["AcademicYear"],
    }
