import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiFilter, FiSearch } from 'react-icons/fi';
import { useWeb3 } from '../context/Web3Context';

const AlertFeedPage = () => {
  const { getAlerts, isConnected, loading } = useWeb3();
  const [alerts, setAlerts] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
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

  const filterAlerts = () => {
    if (activeFilter === 'all') {
      return alerts;
    }
    return alerts.filter(alert => alert.type.toLowerCase() === activeFilter);
  };

  const filteredAlerts = filterAlerts().filter(alert => 
    alert.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    alert.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading || loadingAlerts) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded dark:bg-gray-700 w-48 mb-6 mx-auto"></div>
          <div className="h-32 bg-gray-200 rounded dark:bg-gray-700 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded dark:bg-gray-700 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded dark:bg-gray-700"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Alert Feed</h1>
      
      {/* Search and Filter Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
        <div className="p-4 border-b dark:border-gray-700">
          <div className="flex items-center mb-4">
            <FiFilter className="text-gray-500 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Filter Alerts</h2>
          </div>
          
          {/* Search */}
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="pl-10 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
              placeholder="Search alerts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-3">
            <button 
              className={`py-1 px-3 rounded-full text-sm ${
                activeFilter === 'all' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
              }`}
              onClick={() => setActiveFilter('all')}
            >
              All Alerts
            </button>
            <button 
              className={`py-1 px-3 rounded-full text-sm ${
                activeFilter === 'emergency' 
                  ? 'bg-alert-emergency text-white' 
                  : 'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
              }`}
              onClick={() => setActiveFilter('emergency')}
            >
              Emergency
            </button>
            <button 
              className={`py-1 px-3 rounded-full text-sm ${
                activeFilter === 'warning' 
                  ? 'bg-alert-warning text-white' 
                  : 'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
              }`}
              onClick={() => setActiveFilter('warning')}
            >
              Warning
            </button>
            <button 
              className={`py-1 px-3 rounded-full text-sm ${
                activeFilter === 'info' 
                  ? 'bg-alert-info text-white' 
                  : 'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
              }`}
              onClick={() => setActiveFilter('info')}
            >
              Info
            </button>
            <button 
              className={`py-1 px-3 rounded-full text-sm ${
                activeFilter === 'safe' 
                  ? 'bg-alert-safe text-white' 
                  : 'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
              }`}
              onClick={() => setActiveFilter('safe')}
            >
              Safe/Resolved
            </button>
          </div>
        </div>
        
        {/* Alert List */}
        <div className="divide-y dark:divide-gray-700">
          {!isConnected ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400 mb-4">Connect your wallet to view alerts</p>
              <button className="btn-primary">Connect Wallet</button>
            </div>
          ) : filteredAlerts.length > 0 ? (
            filteredAlerts.map(alert => (
              <Link 
                key={alert.id} 
                to={`/alerts/${alert.id}`} 
                className="block hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <div className="p-4">
                  <div className="flex justify-between">
                    <span className={`text-white text-xs px-2 py-1 rounded-full ${
                      alert.type === 'Emergency' ? 'bg-alert-emergency' :
                      alert.type === 'Warning' ? 'bg-alert-warning' :
                      alert.type === 'Info' ? 'bg-alert-info' : 'bg-alert-safe'
                    }`}>
                      {alert.type}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(alert.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-lg font-medium mt-2 text-gray-900 dark:text-white">{alert.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    {alert.details?.description?.substring(0, 120)}...
                  </p>
                  <div className="mt-3 flex items-center text-sm">
                    <span className="text-gray-500">Location: {alert.location}</span>
                    <span className="mx-2">•</span>
                    <span className="text-gray-500">Status: {alert.status}</span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">No alerts match your criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertFeedPage;