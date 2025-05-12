import React from 'react';

const AlertMapPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Alert Map</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div className="bg-gray-200 dark:bg-gray-700 rounded-lg aspect-video flex items-center justify-center">
          <div className="text-gray-500 dark:text-gray-400">
            <p className="font-medium text-lg">Map Component Will Be Implemented Here</p>
            <p className="text-sm">Using React Map libraries such as React-Map-GL or Leaflet</p>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-gray-700 dark:text-gray-300 text-sm">
            The interactive map will display all active alerts with different pins based on severity and type.
            Users will be able to click on pins to see brief information and click through to the full alert details.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AlertMapPage;