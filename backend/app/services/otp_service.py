import random

# In-memory store for OTPs: { reg_no: otp }
_OTP_STORE = {}

def create_otp(reg_no):
    # Always generate a 6-digit code
    otp = str(random.randint(100000, 999999))
    _OTP_STORE[reg_no] = otp
    print(f"[OTP Service] Generated OTP for {reg_no}: {otp}")
    return otp

def verify_user_otp(reg_no, input_otp):
    if reg_no not in _OTP_STORE:
        return False
    
    stored_otp = _OTP_STORE[reg_no]
    if stored_otp == input_otp:
        # One-time use: Clear after success
        del _OTP_STORE[reg_no]
        return True
    
    return False
