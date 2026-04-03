import pandas as pd

def build_fees_response(rows: pd.DataFrame) -> dict:
    row = rows.iloc[0]
    total_fee  = int(row["TotalFee"])
    paid_fee   = int(row["PaidFee"])
    due_fee    = int(row["DueFee"])
    status     = row["PaymentStatus"]

    text = f"The total fee is {total_fee} rupees. You have paid {paid_fee} rupees. The due amount is {due_fee} rupees. The payment status is {status}."

    return {
        "type": "financial_widget",
        "text": text,
        "data": {
            "totalFee":      total_fee,
            "totalPaid":     paid_fee,
            "totalDues":     due_fee,
            "paymentStatus": status,
            "dueDate":       "Apr 30, 2026",
        },
    }
