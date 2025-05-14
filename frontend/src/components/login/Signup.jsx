import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signupUser, signupOfficial } from '../auth/Api';
import { toast } from 'react-toastify';
import { FiUser, FiMail, FiLock, FiMapPin, FiPhone, FiFileText, FiShield, FiArrowLeft, FiCheck, FiX } from 'react-icons/fi';

const Signup = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userType, setUserType] = useState('user'); // 'user' or 'official'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    location: '',
    verificationDoc: ''
  });
  
  // New state for password validation
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0, // 0-4 (very weak to very strong)
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false
  });
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Check password strength when password field changes
    if (name === 'password') {
      checkPasswordStrength(value);
    }
    
    // Check if passwords match when either password or confirmPassword changes
    if (name === 'password' || name === 'confirmPassword') {
      if (name === 'confirmPassword') {
        setPasswordsMatch(formData.password === value);
      } else {
        setPasswordsMatch(value === formData.confirmPassword);
      }
    }
  };

  // Calculate strength whenever password changes
  useEffect(() => {
    if (formData.confirmPassword) {
      setPasswordsMatch(formData.password === formData.confirmPassword);
    }
  }, [formData.password, formData.confirmPassword]);

  const checkPasswordStrength = (password) => {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    // Calculate score (0-4)
    let score = 0;
    if (hasMinLength) score += 1;
    if (hasUpperCase && hasLowerCase) score += 1;
    if (hasNumber) score += 1;
    if (hasSpecialChar) score += 1;
    
    setPasswordStrength({
      score,
      hasMinLength,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasSpecialChar
    });
  };

  const getPasswordStrengthText = () => {
    const { score } = passwordStrength;
    if (score === 0) return 'Very Weak';
    if (score === 1) return 'Weak';
    if (score === 2) return 'Medium';
    if (score === 3) return 'Strong';
    return 'Very Strong';
  };

  const getPasswordStrengthColor = () => {
    const { score } = passwordStrength;
    if (score === 0) return 'bg-red-500';
    if (score === 1) return 'bg-orange-500';
    if (score === 2) return 'bg-yellow-500';
    if (score === 3) return 'bg-green-500';
    return 'bg-emerald-500';
  };

  const handleUserTypeChange = (type) => {
    setUserType(type);
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error('Please fill in all required fields');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    
    if (passwordStrength.score < 2) {
      toast.error('Password is too weak. Please create a stronger password.');
      return false;
    }

    if (userType === 'official' && !formData.verificationDoc) {
      toast.error('Verification document is required for government officials');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Submit to appropriate endpoint based on user type
      const response = userType === 'user' 
        ? await signupUser(formData)
        : await signupOfficial(formData);
        
      toast.success('Signup successful! Please log in.');
      
      // Store token if returned
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      
      // Redirect to login page or dashboard
      navigate('/signin');
    } catch (error) {
      toast.error(error.message || 'Signup failed. Please try again.');
      console.error('Signup error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <Link to="/" className="flex items-center text-slate-600 hover:text-slate-900 mb-6">
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Back to home
          </Link>
          
          <h2 className="text-center text-3xl font-extrabold text-slate-900 tracking-tight">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Or{' '}
            <Link to="/signin" className="font-medium text-primary hover:text-primary/90">
              sign in to your existing account
            </Link>
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-xl overflow-hidden">
          {/* User Type Selection Tabs */}
          <div className="flex border-b border-slate-200">
            <button
              type="button"
              className={`flex-1 py-4 px-4 text-sm font-medium transition-colors ${
                userType === 'user'
                  ? 'bg-slate-50 border-b-2 border-slate-900 text-slate-900'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
              onClick={() => handleUserTypeChange('user')}
            >
              <FiUser className="inline-block mr-2 h-4 w-4" />
              Citizen
            </button>
            <button
              type="button"
              className={`flex-1 py-4 px-4 text-sm font-medium transition-colors ${
                userType === 'official'
                  ? 'bg-slate-50 border-b-2 border-slate-900 text-slate-900'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
              onClick={() => handleUserTypeChange('official')}
            >
              <FiShield className="inline-block mr-2 h-4 w-4" />
              Government Official
            </button>
          </div>

          <form className="p-6 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                Full Name*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="text-slate-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="pl-10 w-full py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                Email Address*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-slate-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10 w-full py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                  Password*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="text-slate-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 w-full py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                </div>
                
                {/* Password strength section */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-slate-700">Password strength:</span>
                      <span className={`text-xs font-medium ${
                        passwordStrength.score < 2 ? 'text-red-600' : 
                        passwordStrength.score < 3 ? 'text-yellow-600' : 'text-green-600'
                      }`}>{getPasswordStrengthText()}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getPasswordStrengthColor()}`} 
                        style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                      ></div>
                    </div>
                    
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center text-xs">
                        {passwordStrength.hasMinLength ? (
                          <FiCheck className="text-green-500 mr-1 h-3 w-3" />
                        ) : (
                          <FiX className="text-red-500 mr-1 h-3 w-3" />
                        )}
                        <span className="text-slate-600">At least 8 characters</span>
                      </div>
                      <div className="flex items-center text-xs">
                        {passwordStrength.hasUpperCase && passwordStrength.hasLowerCase ? (
                          <FiCheck className="text-green-500 mr-1 h-3 w-3" />
                        ) : (
                          <FiX className="text-red-500 mr-1 h-3 w-3" />
                        )}
                        <span className="text-slate-600">Mix of upper & lowercase letters</span>
                      </div>
                      <div className="flex items-center text-xs">
                        {passwordStrength.hasNumber ? (
                          <FiCheck className="text-green-500 mr-1 h-3 w-3" />
                        ) : (
                          <FiX className="text-red-500 mr-1 h-3 w-3" />
                        )}
                        <span className="text-slate-600">At least one number</span>
                      </div>
                      <div className="flex items-center text-xs">
                        {passwordStrength.hasSpecialChar ? (
                          <FiCheck className="text-green-500 mr-1 h-3 w-3" />
                        ) : (
                          <FiX className="text-red-500 mr-1 h-3 w-3" />
                        )}
                        <span className="text-slate-600">At least one special character</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1">
                  Confirm Password*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="text-slate-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`pl-10 w-full py-2 border ${
                      formData.confirmPassword 
                        ? passwordsMatch ? 'border-green-500' : 'border-red-500'
                        : 'border-slate-300'
                    } rounded-md focus:outline-none focus:ring-2 ${
                      formData.confirmPassword
                        ? passwordsMatch ? 'focus:ring-green-500' : 'focus:ring-red-500'
                        : 'focus:ring-slate-500'
                    } focus:border-transparent transition-all`}
                    placeholder="••••••••"
                  />
                  {formData.confirmPassword && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      {passwordsMatch ? (
                        <FiCheck className="text-green-500 h-4 w-4" />
                      ) : (
                        <FiX className="text-red-500 h-4 w-4" />
                      )}
                    </div>
                  )}
                </div>
                {formData.confirmPassword && !passwordsMatch && (
                  <p className="mt-1 text-xs text-red-600">Passwords do not match</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-slate-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiPhone className="text-slate-400" />
                  </div>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="pl-10 w-full py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                    placeholder="+91 9876543210"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-1">
                  Location
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMapPin className="text-slate-400" />
                  </div>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="pl-10 w-full py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                    placeholder="City, State"
                  />
                </div>
              </div>
            </div>

            {/* Only show this field for officials */}
            {userType === 'official' && (
              <div>
                <label htmlFor="verificationDoc" className="block text-sm font-medium text-slate-700 mb-1">
                  Verification Document* (ID Number)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiFileText className="text-slate-400" />
                  </div>
                  <input
                    id="verificationDoc"
                    name="verificationDoc"
                    type="text"
                    required
                    value={formData.verificationDoc}
                    onChange={handleInputChange}
                    className="pl-10 w-full py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                    placeholder="Government ID Number"
                  />
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Please enter your official government ID number for verification purposes.
                </p>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || (formData.confirmPassword && !passwordsMatch)}
                className={`w-full py-3 px-4 ${
                  isSubmitting || (formData.confirmPassword && !passwordsMatch)
                    ? 'bg-slate-400 cursor-not-allowed'
                    : 'bg-slate-900 hover:bg-slate-800'
                } transition-colors text-white rounded-md font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 flex justify-center items-center`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </form>

          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
            <p className="text-center text-sm text-slate-600">
              Already have an account?{' '}
              <Link to="/signin" className="font-medium text-slate-900 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;