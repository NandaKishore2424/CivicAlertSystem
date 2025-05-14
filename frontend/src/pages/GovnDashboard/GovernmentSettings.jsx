import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Save, Moon, Sun, Bell, 
  User, Globe, Building, BadgeCheck, 
  Shield, AlertTriangle 
} from 'lucide-react';
import { toast } from 'react-toastify';
import { motion } from "framer-motion";

const GovernmentSettings = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    userName: localStorage.getItem('userName') || 'Official',
    officialId: localStorage.getItem('officialId') || 'GMD29584',
    department: localStorage.getItem('department') || 'Department of Emergency Management',
    jurisdiction: localStorage.getItem('jurisdiction') || 'Metro Area',
    darkMode: localStorage.getItem('darkMode') === 'true' || false,
    notificationsEnabled: localStorage.getItem('notificationsEnabled') === 'true' || true,
    emergencyNotificationsOnly: localStorage.getItem('emergencyNotificationsOnly') === 'true' || false,
    language: localStorage.getItem('language') || 'en',
    autoPublish: localStorage.getItem('autoPublish') === 'true' || false,
    requireApproval: localStorage.getItem('requireApproval') === 'true' || true
  });
  
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  
  // Apply dark mode when component mounts and when setting changes
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const saveSettings = () => {
    setIsSaving(true);
    
    setTimeout(() => {
      // Save all settings to localStorage
      Object.entries(settings).forEach(([key, value]) => {
        localStorage.setItem(key, value);
      });
      
      setIsSaving(false);
      toast.success('Settings saved successfully');
    }, 600);
  };
  
  const clearAccountData = () => {
    if (window.confirm('Are you sure you want to clear account data? This will reset all settings but keep your login information.')) {
      localStorage.removeItem('userName');
      localStorage.removeItem('darkMode');
      localStorage.removeItem('notificationsEnabled');
      localStorage.removeItem('emergencyNotificationsOnly');
      localStorage.removeItem('language');
      localStorage.removeItem('autoPublish');
      localStorage.removeItem('requireApproval');
      
      // Reset settings state
      setSettings({
        userName: 'Official',
        officialId: localStorage.getItem('officialId') || 'GMD29584',
        department: localStorage.getItem('department') || 'Department of Emergency Management',
        jurisdiction: localStorage.getItem('jurisdiction') || 'Metro Area',
        darkMode: false,
        notificationsEnabled: true,
        emergencyNotificationsOnly: false,
        language: 'en',
        autoPublish: false,
        requireApproval: true
      });
      
      toast.info('Account data has been cleared');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Header with back button */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/government/dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            <span>Back to Dashboard</span>
          </button>
          
          <button
            onClick={saveSettings}
            className={`flex items-center px-4 py-2 rounded-md bg-black text-white hover:bg-gray-800 transition-colors ${isSaving ? 'opacity-70' : ''}`}
            disabled={isSaving}
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Government Settings</h1>
            <p className="text-gray-500 dark:text-gray-400">Manage your profile, notifications and preferences</p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'profile'
                  ? 'border-b-2 border-black dark:border-white text-black dark:text-white'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'preferences'
                  ? 'border-b-2 border-black dark:border-white text-black dark:text-white'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              Preferences
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'notifications'
                  ? 'border-b-2 border-black dark:border-white text-black dark:text-white'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              Notifications
            </button>
            <button
              onClick={() => setActiveTab('account')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'account'
                  ? 'border-b-2 border-black dark:border-white text-black dark:text-white'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              Account
            </button>
          </div>

          <div className="p-6">
            {/* Profile Section */}
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profile Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="userName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="userName"
                        name="userName"
                        value={settings.userName}
                        onChange={handleInputChange}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-black dark:focus:border-white bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        placeholder="Your full name"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="officialId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Official ID
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <BadgeCheck className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="officialId"
                        name="officialId"
                        value={settings.officialId}
                        onChange={handleInputChange}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-black dark:focus:border-white bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        placeholder="Your official ID"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="department" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Department
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Building className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="department"
                        name="department"
                        value={settings.department}
                        onChange={handleInputChange}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-black dark:focus:border-white bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        placeholder="Your department"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="jurisdiction" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Jurisdiction
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Shield className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="jurisdiction"
                        name="jurisdiction"
                        value={settings.jurisdiction}
                        onChange={handleInputChange}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-black dark:focus:border-white bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        placeholder="Your jurisdiction area"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Preferences Section */}
            {activeTab === 'preferences' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Interface Preferences</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {settings.darkMode ? (
                        <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300 mr-2" />
                      ) : (
                        <Sun className="h-5 w-5 text-amber-500 mr-2" />
                      )}
                      <span className="text-gray-800 dark:text-gray-200">Dark Mode</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="darkMode"
                        checked={settings.darkMode}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                    </label>
                  </div>
                  
                  <div>
                    <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Language
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Globe className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        id="language"
                        name="language"
                        value={settings.language}
                        onChange={handleInputChange}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-black dark:focus:border-white bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      >
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                        <option value="hi">हिन्दी</option>
                        <option value="ta">தமிழ்</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                      <Shield className="h-5 w-5 text-gray-700 dark:text-gray-300 mr-2" />
                      <div>
                        <span className="text-gray-800 dark:text-gray-200">Require Approval</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Require secondary approval before alerts are published</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="requireApproval"
                        checked={settings.requireApproval}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Bell className="h-5 w-5 text-gray-700 dark:text-gray-300 mr-2" />
                      <div>
                        <span className="text-gray-800 dark:text-gray-200">Auto-Publish Alerts</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Automatically publish alerts without confirmation</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="autoPublish"
                        checked={settings.autoPublish}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Notifications Section */}
            {activeTab === 'notifications' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notification Settings</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Bell className="h-5 w-5 text-gray-700 dark:text-gray-300 mr-2" />
                      <span className="text-gray-800 dark:text-gray-200">Enable Notifications</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="notificationsEnabled"
                        checked={settings.notificationsEnabled}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <AlertTriangle className="h-5 w-5 text-gray-700 dark:text-gray-300 mr-2" />
                      <div>
                        <span className="text-gray-800 dark:text-gray-200">Emergency Notifications Only</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Only receive notifications for emergency alerts</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="emergencyNotificationsOnly"
                        checked={settings.emergencyNotificationsOnly}
                        onChange={handleInputChange}
                        disabled={!settings.notificationsEnabled}
                        className="sr-only peer"
                      />
                      <div className={`w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black ${!settings.notificationsEnabled ? 'opacity-50' : ''}`}></div>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Account Section */}
            {activeTab === 'account' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account Management</h2>
                
                <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="text-gray-700 dark:text-gray-300 mb-1">Clear Account Data</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Reset all settings while keeping login information.</p>
                    <button
                      onClick={clearAccountData}
                      className="px-4 py-2 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-md transition-colors"
                    >
                      Clear Data
                    </button>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-gray-700 dark:text-gray-300 mb-1">Logout</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Sign out from all devices.</p>
                    <button
                      onClick={() => {
                        // Clear auth tokens
                        localStorage.removeItem("token");
                        toast.success("Logged out successfully");
                        navigate('/signin');
                      }}
                      className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 rounded-md transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GovernmentSettings;