import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signinUser, signinOfficial } from '../auth/Api';
import { toast } from 'react-toastify';
import { FiMail, FiLock, FiUser, FiShield, FiArrowLeft } from 'react-icons/fi';

const Signin = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userType, setUserType] = useState('user'); // 'user' or 'official'
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUserTypeChange = (type) => {
    setUserType(type);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Please enter both email and password');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Call appropriate API based on user type
      const response = userType === 'user' 
        ? await signinUser(formData)
        : await signinOfficial(formData);
      
      // Store token
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userType', userType);
        
        // Store user information
        if (userType === 'official') {
          // Set default values for government officials
          localStorage.setItem("officialId", "GMD" + Math.floor(Math.random() * 90000 + 10000));
          localStorage.setItem("department", formData.email.split('@')[0] || "Department of Emergency Management");
          localStorage.setItem("userName", formData.email.split('@')[0] || "Government Official");
        } else {
          // Set default values for regular users
          localStorage.setItem("userName", formData.email.split('@')[0] || "Citizen User");
        }
        
        toast.success('Login successful!');

        // Redirect based on user type
        if (userType === 'user') {
          navigate('/citizen/dashboard');
        } else {
          navigate('/government/dashboard');
        }
      } else {
        toast.error('Login failed: No authentication token received');
      }
    } catch (error) {
      toast.error(error.message || 'Login failed. Please check your credentials.');
      console.error('Login error:', error);
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
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Or{' '}
            <Link to="/signup" className="font-medium text-primary hover:text-primary/90">
              create a new account
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
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                Email Address
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

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                Password
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
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember_me"
                  name="remember_me"
                  type="checkbox"
                  className="h-4 w-4 text-slate-900 focus:ring-slate-500 border-slate-300 rounded"
                />
                <label htmlFor="remember_me" className="ml-2 block text-sm text-slate-700">
                  Remember me
                </label>
              </div>
              <div>
                <button 
                  onClick={() => navigate('/forgot-password')} 
                  className="text-sm font-medium text-slate-700 hover:text-slate-900"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 transition-colors text-white rounded-md font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 flex justify-center items-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </form>

          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
            <div className="relative py-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-2 bg-slate-50 text-sm text-slate-500">Or continue with</span>
              </div>
            </div>
            
            <button
              type="button"
              onClick={() => navigate('/connect-wallet')}
              className="w-full mt-3 py-2 px-4 border border-slate-300 rounded-md shadow-sm bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 10V8C6 4.69 8.69 2 12 2C15.31 2 18 4.69 18 8V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M17 22H7C5.89543 22 5 21.1046 5 20V12C5 10.8954 5.89543 10 7 10H17C18.1046 10 19 10.8954 19 12V20C19 21.1046 18.1046 22 17 22Z" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;