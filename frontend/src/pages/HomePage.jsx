import React from 'react';
import { Link } from 'react-router-dom';
import { FiAlertTriangle, FiMap, FiShield } from 'react-icons/fi';

const HomePage = () => {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-20">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Decentralized Emergency Alert Platform
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Get verified, transparent, and tamper-proof emergency alerts powered by blockchain technology
        </p>
        <div className="flex flex-wrap justify-center gap-4 mb-4">
          <Link to="/alerts" className="btn-primary">
            View Alerts
          </Link>
          <Link
            to="/map"
            className="btn bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            Open Alert Map
          </Link>
        </div>
        {/* New Login & Signup Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/signin" className="btn bg-blue-600 text-white hover:bg-blue-700">
            Login
          </Link>
          <Link to="/signup" className="btn bg-green-600 text-white hover:bg-green-700">
            Signup
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8 my-16">
        <div className="card">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
            <FiShield className="w-6 h-6 text-primary-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Blockchain Verified</h3>
          <p className="text-gray-600 dark:text-gray-300">
            All alerts are stored on blockchain, ensuring tamper-proof verification and audit trails.
          </p>
        </div>
        <div className="card">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
            <FiMap className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Geo-Tagged Alerts</h3>
          <p className="text-gray-600 dark:text-gray-300">
            See alerts specific to your location and get real-time updates during emergencies.
          </p>
        </div>
        <div className="card">
          <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center mb-4">
            <FiAlertTriangle className="w-6 h-6 text-yellow-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Critical Information</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Access vital emergency information verified by authorized government agencies.
          </p>
        </div>
      </div>

      {/* Recent Alerts Preview */}
      <div className="my-16">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Recent Alerts</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
            <div>
              <span className="bg-alert-emergency text-white text-xs px-2.5 py-1 rounded-full">Emergency</span>
              <h3 className="text-lg font-medium mt-1 text-gray-900 dark:text-white">Water Contamination Warning</h3>
            </div>
            <span className="text-sm text-gray-500">2 hours ago</span>
          </div>
          <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
            <div>
              <span className="bg-alert-warning text-white text-xs px-2.5 py-1 rounded-full">Warning</span>
              <h3 className="text-lg font-medium mt-1 text-gray-900 dark:text-white">Severe Weather Alert</h3>
            </div>
            <span className="text-sm text-gray-500">5 hours ago</span>
          </div>
          <div className="p-4 flex justify-between items-center">
            <div>
              <span className="bg-alert-info text-white text-xs px-2.5 py-1 rounded-full">Info</span>
              <h3 className="text-lg font-medium mt-1 text-gray-900 dark:text-white">Road Closure Notice</h3>
            </div>
            <span className="text-sm text-gray-500">1 day ago</span>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 py-3 text-center">
            <Link to="/alerts" className="text-primary-600 hover:underline dark:text-primary-500">
              View all alerts →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
