import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Save, Moon, Sun, Bell, User, Globe, MapPin } from 'lucide-react';
import { toast } from 'react-toastify';

const SettingsPage = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    userName: localStorage.getItem('userName') || 'Responder',
    darkMode: localStorage.getItem('darkMode') === 'true' || false,
    notificationsEnabled: localStorage.getItem('notificationsEnabled') === 'true' || true,
    language: localStorage.getItem('language') || 'en',
    locationSharing: localStorage.getItem('locationSharing') === 'true' || true
  });
  
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
    // Save all settings to localStorage
    Object.entries(settings).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });
    
    // Show success message
    toast.success('Settings saved successfully');
  };
  
  const resetAccount = () => {
    if (window.confirm('Are you sure you want to reset your account? This will clear all saved preferences.')) {
      // Clear relevant localStorage items
      localStorage.removeItem('userName');
      localStorage.removeItem('darkMode');
      localStorage.removeItem('notificationsEnabled');
      localStorage.removeItem('language');
      localStorage.removeItem('locationSharing');
      
      // Reset settings state
      setSettings({
        userName: 'Responder',
        darkMode: false,
        notificationsEnabled: true,
        language: 'en',
        locationSharing: true
      });
      
      toast.info('Account has been reset');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-slate-600 hover:text-slate-900 mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        <span>Back</span>
      </button>
      
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
            <button
              onClick={saveSettings}
              className="flex items-center bg-slate-900 hover:bg-slate-800 text-white py-2 px-4 rounded-md"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </button>
          </div>
          
          {/* Profile Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Profile</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="userName" className="block text-sm font-medium text-slate-700 mb-1">
                  Display Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    id="userName"
                    name="userName"
                    value={settings.userName}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                    placeholder="Your display name"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Appearance Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Appearance</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {settings.darkMode ? (
                    <Moon className="h-5 w-5 text-slate-700 mr-2" />
                  ) : (
                    <Sun className="h-5 w-5 text-amber-500 mr-2" />
                  )}
                  <span className="text-slate-800">Dark Mode</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="darkMode"
                    checked={settings.darkMode}
                    onChange={handleInputChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-600"></div>
                </label>
              </div>
              
              <div>
                <label htmlFor="language" className="block text-sm font-medium text-slate-700 mb-1">
                  Language
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Globe className="h-5 w-5 text-slate-400" />
                  </div>
                  <select
                    id="language"
                    name="language"
                    value={settings.language}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
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
            </div>
          </div>
          
          {/* Notifications Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Notifications</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Bell className="h-5 w-5 text-slate-700 mr-2" />
                  <span className="text-slate-800">Enable Notifications</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="notificationsEnabled"
                    checked={settings.notificationsEnabled}
                    onChange={handleInputChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-slate-700 mr-2" />
                  <span className="text-slate-800">Share Location</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="locationSharing"
                    checked={settings.locationSharing}
                    onChange={handleInputChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-600"></div>
                </label>
              </div>
            </div>
          </div>
          
          {/* Account Actions */}
          <div className="border-t border-slate-200 pt-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Account Actions</h2>
            <button
              onClick={resetAccount}
              className="bg-red-50 text-red-700 hover:bg-red-100 py-2 px-4 rounded-md transition-colors"
            >
              Reset Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;