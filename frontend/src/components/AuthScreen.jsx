import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Phone, KeyRound, ArrowRight, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';
import API_BASE from '../api/config';

const AuthScreen = ({ onAuthenticated }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [studentInfo, setStudentInfo] = useState(null);
  const [demoOtp, setDemoOtp] = useState('');
  const [formData, setFormData] = useState({
    regNo: '',
    phone: '',
    otp: ''
  });

  const handleChange = (e) => {
    let { name, value } = e.target;
    
    // Strict 10-digit validation for phone number
    if (name === 'phone') {
      value = value.replace(/\D/g, '').slice(0, 10);
    }
    
    setFormData({ ...formData, [name]: value });
    setError('');
  };

  const handleNextStep = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (step === 1) {
      // Step 1: Verify RegNo against real backend
      try {
        const res = await fetch(`${API_BASE}/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ regNo: formData.regNo }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          setError(data.message || 'Student not found. Please check the registration number.');
          setLoading(false);
          return;
        }
        setStudentInfo(data.student);
        setStep(2);
      } catch (err) {
        console.error('Auth verification error:', err);
        setError('Cannot reach the backend server. Please make sure the Flask server is running on port 5001.');
      } finally {
        setLoading(false);
      }

    } else if (step === 2) {
      // Step 2: Phone validation against backend
      if (formData.phone.length !== 10) {
        setError('Please enter a valid 10-digit mobile number.');
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API_BASE}/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ regNo: formData.regNo, phone: formData.phone }),
        });
        const data = await res.json();
        
        if (!res.ok || !data.success) {
          setError(data.message || 'Mobile number did not match. Please provide the correct mobile number.');
          setLoading(false);
          return;
        }
        
        // Match successful!
        if (data.otp_sent) {
          setDemoOtp(data.demo_otp); // Store for simulation
          setStep(3);
        } else {
          setStep(3);
        }
      } catch (err) {
        console.error('Phone validation error:', err);
        setError('Cannot reach the backend server.');
      } finally {
        setLoading(false);
      }

    } else if (step === 3) {
      // Step 3: Real OTP validation via backend
      try {
        const res = await fetch(`${API_BASE}/otp/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ regNo: formData.regNo, otp: formData.otp }),
        });
        const data = await res.json();
        
        if (!res.ok || !data.success) {
          setError(data.message || 'Incorrect OTP. Please try again.');
          setLoading(false);
          return;
        }

        // Authentication successful!
        setDemoOtp('');
        onAuthenticated(studentInfo);
      } catch (err) {
        console.error('OTP verification error:', err);
        setError('Verification failed. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
  };

  const slideVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { x: -50, opacity: 0, transition: { duration: 0.3 } }
  };

  return (
    <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="glass-panel p-8 md:p-12 rounded-3xl w-full max-w-md relative z-10 border border-white/10 shadow-[0_0_50px_rgba(59,130,246,0.15)]"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent mb-4 shadow-lg">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">EduConnect</h1>
          <p className="text-textMuted">Parent Verification Portal</p>
          {studentInfo && step > 1 && (
            <p className="text-primary/80 text-sm mt-2 font-medium">Welcome, parent of {studentInfo.name}</p>
          )}
        </div>

        <div className="flex justify-between items-center mb-8 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-white/5 rounded-full">
            <motion.div 
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${((step - 1) / 2) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          {[1, 2, 3].map((num) => (
            <div 
              key={num}
              className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-300 ${
                step >= num ? 'bg-primary text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-surface text-textMuted border border-white/10'
              }`}
            >
              {num}
            </div>
          ))}
        </div>

        {/* Simulated SMS Notification */}
        <AnimatePresence>
          {demoOtp && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="fixed top-4 right-4 z-[100] w-72 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl pointer-events-none"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <KeyRound className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white uppercase tracking-wider">Messages</p>
                  <p className="text-[10px] text-textMuted">Just now</p>
                </div>
              </div>
              <p className="text-sm text-gray-200">
                <span className="font-bold text-primary">EduConnect:</span> Your verification code is <span className="font-mono font-bold tracking-widest text-white bg-white/10 px-2 py-0.5 rounded">{demoOtp}</span>. Valid for 10 minutes.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-start gap-2 mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
            >
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.form key="step1" variants={slideVariants} initial="hidden" animate="visible" exit="exit" onSubmit={handleNextStep}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-textMuted mb-2">Student Registration Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-textMuted" />
                    </div>
                    <input
                      type="text"
                      name="regNo"
                      required
                      value={formData.regNo}
                      onChange={handleChange}
                      className="glass-input block w-full pl-12 pr-4 py-3 rounded-xl sm:text-sm"
                      placeholder="Enter Student RegNo"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading || !formData.regNo}
                  className="w-full flex tracking-wide items-center justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-primary to-accent hover:from-primaryHover hover:to-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                    <>
                      Verify Student <ArrowRight className="ml-2 w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </motion.form>
          )}

          {step === 2 && (
            <motion.form key="step2" variants={slideVariants} initial="hidden" animate="visible" exit="exit" onSubmit={handleNextStep}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-textMuted mb-2">Registered Phone Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-textMuted" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      pattern="[0-9]*"
                      inputMode="numeric"
                      className="glass-input block w-full pl-12 pr-4 py-3 rounded-xl sm:text-sm"
                      placeholder="10-Digit Parent Number"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading || !formData.phone}
                  className="w-full flex tracking-wide items-center justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-primary to-accent hover:from-primaryHover hover:to-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-background disabled:opacity-50 transition-all"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                    <>
                      Send OTP <ArrowRight className="ml-2 w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </motion.form>
          )}

          {step === 3 && (
            <motion.form key="step3" variants={slideVariants} initial="hidden" animate="visible" exit="exit" onSubmit={handleNextStep}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-textMuted mb-2">Enter OTP</label>
                  <p className="text-xs text-textMuted mb-3">Sent to {formData.phone || 'your phone'}</p>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <KeyRound className="h-5 w-5 text-textMuted" />
                    </div>
                    <input
                      type="text"
                      name="otp"
                      required
                      maxLength={6}
                      value={formData.otp}
                      onChange={handleChange}
                      className="glass-input block w-full pl-12 pr-4 py-3 rounded-xl sm:text-xl tracking-[0.5em] text-center"
                      placeholder="••••••"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading || formData.otp.length < 4}
                  className="w-full flex tracking-wide items-center justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus:ring-offset-background disabled:opacity-50 transition-all"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                    <>
                      Complete Verification <ShieldCheck className="ml-2 w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
    </motion.div>
  );
};

export default AuthScreen;
