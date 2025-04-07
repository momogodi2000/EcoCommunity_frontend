import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  Check, 
  AlertCircle, 
  RefreshCw,
  ChevronRight,
  Shield,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { requestPasswordReset, resetPassword, verifyResetCode } from "../Services/auth.js";

// Custom animated alert component
const AnimatedAlert = ({ type, message, description, onClose }) => {
  const colors = {
    success: 'bg-emerald-50 border-emerald-500 text-emerald-700',
    error: 'bg-red-50 border-red-500 text-red-700',
    info: 'bg-blue-50 border-blue-500 text-blue-700',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`rounded-lg border-l-4 p-4 my-4 ${colors[type]} relative`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {type === 'success' && <Check className="h-5 w-5 text-emerald-500" />}
          {type === 'error' && <AlertCircle className="h-5 w-5 text-red-500" />}
          {type === 'info' && <AlertCircle className="h-5 w-5 text-blue-500" />}
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium">{message}</h3>
          {description && <div className="mt-1 text-sm opacity-90">{description}</div>}
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Close</span>
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </motion.div>
  );
};

// Custom button component with loading animation
const Button = ({ children, loading, disabled, ...props }) => {
  return (
    <button
      disabled={loading || disabled}
      className="w-full bg-gradient-to-r from-emerald-600 to-emerald-800 text-white py-3 px-4 rounded-lg 
                hover:from-emerald-700 hover:to-emerald-900 transition-all duration-300 
                shadow-md hover:shadow-lg transform hover:-translate-y-1 
                disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                disabled:shadow-none disabled:hover:shadow-none flex justify-center items-center"
      {...props}
    >
      {loading ? (
        <span className="flex items-center">
          <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

// Input field component with animation
const AnimatedInput = ({ icon, type, value, onChange, placeholder, disabled, ...props }) => {
  const Icon = icon;
  
  return (
    <div className="relative group">
      <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors duration-200 group-focus-within:text-emerald-600" />
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 
                 shadow-sm focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600
                 transition-all duration-200 bg-white hover:border-gray-400"
        placeholder={placeholder}
        disabled={disabled}
        {...props}
      />
      <motion.div 
        initial={false}
        animate={{ scaleX: value ? 1 : 0 }}
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 origin-left"
      />
    </div>
  );
};

const ForgotPassword = () => {
    const [stage, setStage] = useState('forgot');
    const [email, setEmail] = useState('');
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const [countdown, setCountdown] = useState(0);
    const [focusedInput, setFocusedInput] = useState(null);
    const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

    // Password validation state
    const [isPasswordValid, setIsPasswordValid] = useState({
        length: false,
        number: false,
        mixedCase: false,
        special: false
    });

    // Start countdown for resend code
    useEffect(() => {
        if (stage === 'verify' && countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown, stage]);

    // Password validation function with additional checks
    const validatePassword = (password) => {
        setIsPasswordValid({
            length: password.length >= 8,
            number: /\d/.test(password),
            mixedCase: /[a-z]/.test(password) && /[A-Z]/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        });
    };

    // Handle OTP input with improved focus management
    const handleCodeChange = (index, value) => {
        if (value.length > 1) {
            // If pasting multiple digits
            const pastedValue = value.split('').slice(0, 6);
            const newCode = [...code];
            
            pastedValue.forEach((digit, i) => {
                if (index + i < 6) {
                    newCode[index + i] = digit;
                }
            });
            
            setCode(newCode);
            
            if (pastedValue.length + index >= 6) {
                document.getElementById(`code-5`).focus();
            } else {
                document.getElementById(`code-${index + pastedValue.length}`).focus();
            }
            
            return;
        }
        
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        if (value && index < 5) {
            const nextInput = document.getElementById(`code-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    // Handle backspace in OTP input
    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            const prevInput = document.getElementById(`code-${index - 1}`);
            if (prevInput) {
                prevInput.focus();
                
                // Optional: Clear the previous input when backspace is pressed
                const newCode = [...code];
                newCode[index - 1] = '';
                setCode(newCode);
            }
        }
    };

    // Handle password reset request
    const handleRequestReset = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        setSubmitStatus(null);

        try {
            await requestPasswordReset(email);
            setSubmitStatus('success');
            setCountdown(60); // 60 second countdown for resend
            
            // Show success animation
            setShowSuccessAnimation(true);
            setTimeout(() => {
                setShowSuccessAnimation(false);
                setStage('verify');
            }, 1500);
        } catch (error) {
            setSubmitStatus('error');
            setError(error.message || "Failed to send verification code. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Handle resend code
    const handleResendCode = async () => {
        setError('');
        setLoading(true);
        setSubmitStatus(null);

        try {
            await requestPasswordReset(email);
            setSubmitStatus('success');
            setCountdown(60); // Reset countdown
        } catch (error) {
            setSubmitStatus('error');
            setError(error.message || "Failed to resend code. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Handle verification code submission
    const handleVerifyCode = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        setSubmitStatus(null);

        try {
            await verifyResetCode(email, code.join(''));
            setSubmitStatus('success');
            
            // Show success animation
            setShowSuccessAnimation(true);
            setTimeout(() => {
                setShowSuccessAnimation(false);
                setStage('reset');
            }, 1500);
        } catch (error) {
            setSubmitStatus('error');
            setError(error.message || "Invalid verification code. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Handle password reset
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitStatus(null);

        if (!Object.values(isPasswordValid).every(Boolean)) {
            setError('Please meet all password requirements');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            await resetPassword(
                email,
                code.join(''),
                newPassword,
                confirmPassword
            );
            setSubmitStatus('success');
            
            // Show success animation
            setShowSuccessAnimation(true);
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
        } catch (error) {
            setSubmitStatus('error');
            setError(error.message || 'Password reset failed');
        } finally {
            setLoading(false);
        }
    };

    // Password strength indicator
    const getPasswordStrength = () => {
        const criteria = Object.values(isPasswordValid);
        const metCriteria = criteria.filter(Boolean).length;
        
        if (metCriteria === 0) return { text: "Very Weak", color: "bg-red-500", width: "w-1/4" };
        if (metCriteria === 1) return { text: "Weak", color: "bg-orange-500", width: "w-2/4" };
        if (metCriteria === 2) return { text: "Medium", color: "bg-yellow-500", width: "w-3/4" };
        if (metCriteria === 3) return { text: "Strong", color: "bg-emerald-500", width: "w-4/5" };
        return { text: "Very Strong", color: "bg-green-500", width: "w-full" };
    };

    const passwordStrength = getPasswordStrength();

    const renderForgotPassword = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            <div className="text-center">
                <motion.div
                    className="inline-block p-3 bg-emerald-100 rounded-full mb-4"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                        type: "spring",
                        stiffness: 260,
                        damping: 20 
                    }}
                >
                    <Mail className="w-8 h-8 text-emerald-700" />
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
                <p className="text-gray-600 mb-6">
                    Enter your email address to receive a verification code
                </p>
            </div>

            <form onSubmit={handleRequestReset} className="space-y-6">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Email Address
                    </label>
                    <AnimatedInput
                        icon={Mail}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="youremail@example.com"
                        required
                        disabled={loading}
                    />
                </div>

                <Button type="submit" loading={loading}>
                    Send Reset Code <ChevronRight className="ml-1 w-4 h-4" />
                </Button>

                <div className="pt-4 text-center">
                    <a 
                        href="/login" 
                        className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors 
                                   duration-200 inline-flex items-center hover:underline"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Login
                    </a>
                </div>
            </form>
        </motion.div>
    );

    const renderVerifyCode = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            <div className="text-center">
                <motion.div
                    className="inline-block p-3 bg-emerald-100 rounded-full mb-4"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                        type: "spring",
                        stiffness: 260,
                        damping: 20 
                    }}
                >
                    <Shield className="w-8 h-8 text-emerald-700" />
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification</h2>
                <p className="text-gray-600">
                    Enter the 6-digit code sent to
                </p>
                <p className="text-emerald-700 font-medium mb-6">
                    {email}
                </p>
            </div>

            <form onSubmit={handleVerifyCode} className="space-y-6">
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">
                        Verification Code
                    </label>
                    <div className="flex justify-between space-x-2">
                        {code.map((digit, index) => (
                            <motion.div 
                                key={index}
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className="relative"
                            >
                                <input
                                    id={`code-${index}`}
                                    type="text"
                                    maxLength="1"
                                    value={digit}
                                    onChange={(e) => handleCodeChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onFocus={() => setFocusedInput(index)}
                                    onBlur={() => setFocusedInput(null)}
                                    className={`w-12 h-14 text-center text-xl font-semibold border rounded-lg 
                                              transition-all duration-300 focus:outline-none focus:ring-2
                                              ${focusedInput === index 
                                                ? 'border-emerald-600 ring-2 ring-emerald-600 ring-opacity-50 shadow-md' 
                                                : 'border-gray-300 hover:border-gray-400'}`}
                                    required
                                    disabled={loading}
                                    autoComplete="one-time-code"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                />
                                <motion.div 
                                    initial={false}
                                    animate={{ 
                                        scaleX: digit ? 1 : 0,
                                        opacity: digit ? 1 : 0 
                                    }}
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 origin-left"
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>

                <Button type="submit" loading={loading} disabled={code.some(digit => !digit)}>
                    Verify Code <ChevronRight className="ml-1 w-4 h-4" />
                </Button>

                <div className="pt-2">
                    <div className="flex justify-center text-sm mb-2">
                        <Clock className="w-4 h-4 mr-1 text-gray-500" />
                        <span className="text-gray-500">
                            {countdown > 0 
                                ? `Resend code in ${countdown}s` 
                                : "Didn't receive the code?"
                            }
                        </span>
                    </div>
                    {countdown === 0 && (
                        <button
                            type="button"
                            onClick={handleResendCode}
                            disabled={loading}
                            className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors 
                                    duration-200 flex items-center justify-center w-full hover:underline"
                        >
                            Resend code
                        </button>
                    )}
                </div>
            </form>
        </motion.div>
    );

    const renderResetPassword = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            <div className="text-center">
                <motion.div
                    className="inline-block p-3 bg-emerald-100 rounded-full mb-4"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                        type: "spring",
                        stiffness: 260,
                        damping: 20 
                    }}
                >
                    <Lock className="w-8 h-8 text-emerald-700" />
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Create New Password</h2>
                <p className="text-gray-600 mb-6">
                    Your password must be different from previous passwords
                </p>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-6">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        New Password
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type={showPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => {
                                setNewPassword(e.target.value);
                                validatePassword(e.target.value);
                            }}
                            className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 
                                    transition-all duration-200 focus:ring-2 focus:ring-emerald-600 
                                    focus:border-emerald-600 hover:border-gray-400"
                            placeholder="Enter new password"
                            required
                            disabled={loading}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 
                                      hover:text-gray-700 transition-colors duration-200"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Password strength indicator */}
                <div className="space-y-1">
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Password strength:</span>
                        <span className={`text-xs font-medium ${
                            passwordStrength.text === "Very Weak" || passwordStrength.text === "Weak" 
                                ? "text-red-600" 
                                : passwordStrength.text === "Medium" 
                                    ? "text-yellow-600" 
                                    : "text-green-600"
                        }`}>
                            {passwordStrength.text}
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                        <motion.div 
                            className={`h-full ${passwordStrength.color}`}
                            initial={{ width: "0%" }}
                            animate={{ width: passwordStrength.width }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Confirm Password
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={`w-full pl-10 pr-12 py-3 rounded-lg border transition-all duration-200
                                      focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 hover:border-gray-400
                                      ${confirmPassword && confirmPassword !== newPassword 
                                         ? 'border-red-500 bg-red-50' 
                                         : confirmPassword 
                                            ? 'border-green-500 bg-green-50' 
                                            : 'border-gray-300'}`}
                            placeholder="Confirm your password"
                            required
                            disabled={loading}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 
                                     hover:text-gray-700 transition-colors duration-200"
                        >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                        {confirmPassword && confirmPassword !== newPassword && (
                            <p className="mt-1 text-xs text-red-600">Passwords do not match</p>
                        )}
                    </div>
                </div>

                <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-700 font-medium mb-2">Password Requirements:</p>
                    <p className="text-sm text-gray-600 flex items-center">
                        <motion.div
                            animate={{ 
                                scale: isPasswordValid.length ? [1, 1.2, 1] : 1,
                                color: isPasswordValid.length ? '#10b981' : '#d1d5db'  
                            }}
                            transition={{ duration: 0.3 }}
                        >
                            <Check className={`w-4 h-4 mr-2 ${isPasswordValid.length ? 'text-emerald-500' : 'text-gray-300'}`} />
                        </motion.div>
                        At least 8 characters long
                    </p>
                    <p className="text-sm text-gray-600 flex items-center">
                        <motion.div
                            animate={{ 
                                scale: isPasswordValid.number ? [1, 1.2, 1] : 1,
                                color: isPasswordValid.number ? '#10b981' : '#d1d5db'  
                            }}
                            transition={{ duration: 0.3 }}
                        >
                            <Check className={`w-4 h-4 mr-2 ${isPasswordValid.number ? 'text-emerald-500' : 'text-gray-300'}`} />
                        </motion.div>
                        Contains at least one number
                    </p>
                    <p className="text-sm text-gray-600 flex items-center">
                        <motion.div
                            animate={{ 
                                scale: isPasswordValid.mixedCase ? [1, 1.2, 1] : 1,
                                color: isPasswordValid.mixedCase ? '#10b981' : '#d1d5db'  
                            }}
                            transition={{ duration: 0.3 }}
                        >
                            <Check className={`w-4 h-4 mr-2 ${isPasswordValid.mixedCase ? 'text-emerald-500' : 'text-gray-300'}`} />
                        </motion.div>
                        Contains both uppercase and lowercase letters
                    </p>
                    <p className="text-sm text-gray-600 flex items-center">
                        <motion.div
                            animate={{ 
                                scale: isPasswordValid.special ? [1, 1.2, 1] : 1,
                                color: isPasswordValid.special ? '#10b981' : '#d1d5db'  
                            }}
                            transition={{ duration: 0.3 }}
                        >
                            <Check className={`w-4 h-4 mr-2 ${isPasswordValid.special ? 'text-emerald-500' : 'text-gray-300'}`} />
                        </motion.div>
                        Contains at least one special character (!@#$%^&*)
                    </p>
                </div>

                <Button 
                    type="submit" 
                    loading={loading} 
                    disabled={!Object.values(isPasswordValid).every(Boolean) || !confirmPassword || newPassword !== confirmPassword}
                >
                    Reset Password <ChevronRight className="ml-1 w-4 h-4" />
                </Button>
            </form>
        </motion.div>
    );

    // Success animation
    const SuccessAnimation = () => (
        <motion.div 
            className="fixed inset-0 bg-emerald-600 bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div 
                className="bg-white rounded-full p-4"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                    type: "spring",
                    stiffness: 300,
                    damping: 20 
                }}
            >
                <motion.div
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <svg className="w-16 h-16 text-emerald-600" viewBox="0 0 24 24">
                        <motion.path
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        />
                    </svg>
                </motion.div>
            </motion.div>
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex flex-col">
            {/* Navigation */}
            <nav className="bg-gradient-to-r from-emerald-700 to-emerald-900 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex-shrink-0">
                            <a href="/" className="text-xl font-bold flex items-center">
                                <svg className="w-8 h-8 mr-2" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" />
                                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" />
                                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" />
                                </svg>
                                YourApp
                            </a>
                        </div>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-center space-x-4">
                                <a href="/features" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-emerald-800 transition-colors duration-200">Features</a>
                                <a href="/pricing" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-emerald-800 transition-colors duration-200">Pricing</a>
                                <a href="/support" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-emerald-800 transition-colors duration-200">Support</a>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-grow flex items-center justify-center p-4">
                <div className="w-full max-w-md mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-8">
                        <AnimatePresence mode="wait">
                            {showSuccessAnimation && <SuccessAnimation />}
                            
                            {submitStatus === 'success' && (
                                <AnimatedAlert 
                                    type="success" 
                                    message="Success!" 
                                    description={
                                        stage === 'forgot' 
                                            ? "Verification code sent to your email" 
                                            : stage === 'verify' 
                                                ? "Code verified successfully" 
                                                : "Password reset successfully"
                                    } 
                                    onClose={() => setSubmitStatus(null)}
                                />
                            )}
                            
                            {submitStatus === 'error' && (
                                <AnimatedAlert 
                                    type="error" 
                                    message="Error" 
                                    description={error} 
                                    onClose={() => setSubmitStatus(null)}
                                />
                            )}
                            
                            {stage === 'forgot' && renderForgotPassword()}
                            {stage === 'verify' && renderVerifyCode()}
                            {stage === 'reset' && renderResetPassword()}
                        </AnimatePresence>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gradient-to-r from-emerald-700 to-emerald-900 text-white py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center space-x-2 mb-4 md:mb-0">
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" />
                                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" />
                                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" />
                            </svg>
                            <span className="text-lg font-semibold">YourApp</span>
                        </div>
                        <div className="flex space-x-6">
                            <a href="/privacy" className="text-sm hover:text-emerald-200 transition-colors duration-200">Privacy Policy</a>
                            <a href="/terms" className="text-sm hover:text-emerald-200 transition-colors duration-200">Terms of Service</a>
                            <a href="/contact" className="text-sm hover:text-emerald-200 transition-colors duration-200">Contact Us</a>
                        </div>
                    </div>
                    <div className="mt-4 text-center md:text-left text-xs text-emerald-200">
                        © {new Date().getFullYear()} YourApp. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default ForgotPassword;