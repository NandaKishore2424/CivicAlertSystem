import React from 'react';
import { Link } from 'react-router-dom';
import { FiAlertTriangle, FiHome } from 'react-icons/fi';

const NotFoundPage = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <FiAlertTriangle className="w-20 h-20 text-yellow-500 mb-6" />
      <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">Page Not Found</h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn-primary flex items-center">
        <FiHome className="mr-2" /> Return to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;