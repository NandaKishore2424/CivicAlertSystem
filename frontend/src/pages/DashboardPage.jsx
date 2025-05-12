import React from 'react';

const DashboardPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Government Dashboard</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <p className="text-gray-700 dark:text-gray-300">
          This dashboard is only accessible to authorized government agencies with the proper wallet credentials.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Create New Alert</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Issue a new emergency alert that will be published to the blockchain and distributed to citizens.
          </p>
          <button className="btn-primary">Create Alert</button>
        </div>
        <div className="card">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Manage Active Alerts</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            View and update alerts you've issued or mark them as resolved.
          </p>
          <button className="btn-primary">View Active Alerts</button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;