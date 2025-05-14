import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';

const AlertFeedPage = () => {
  const { getAlerts, isConnected } = useWeb3();
  // eslint-disable-next-line no-unused-vars
  const [alerts, setAlerts] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [activeFilter, setActiveFilter] = useState('all');
  // eslint-disable-next-line no-unused-vars
  const [searchTerm, setSearchTerm] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [loadingAlerts, setLoadingAlerts] = useState(false);

  useEffect(() => {
    const fetchAlerts = async () => {
      if (isConnected) {
        setLoadingAlerts(true);
        try {
          const fetchedAlerts = await getAlerts(0, 20);
          setAlerts(fetchedAlerts);
        } catch (error) {
          console.error("Error fetching alerts:", error);
        } finally {
          setLoadingAlerts(false);
        }
      }
    };

    fetchAlerts();
  }, [isConnected, getAlerts]);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Alert Feed</h1>
      
      {/* Simple placeholder for now */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="p-4 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            Alert Feed content will be displayed here
          </p>
        </div>
      </div>
    </div>
  );
};

export default AlertFeedPage;