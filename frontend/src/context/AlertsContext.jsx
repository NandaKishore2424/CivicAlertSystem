import React, { createContext, useState, useContext } from 'react';

const AlertsContext = createContext();

export const AlertsProvider = ({ children }) => {
  const [alertsCache, setAlertsCache] = useState({});

  const cacheAlert = (id, alertData) => {
    setAlertsCache(prev => ({
      ...prev,
      [id]: {
        ...alertData,
        timestamp: Date.now() // Add timestamp for cache invalidation
      }
    }));
  };

  const getCachedAlert = (id) => {
    return alertsCache[id];
  };

  return (
    <AlertsContext.Provider 
      value={{
        cacheAlert,
        getCachedAlert,
        alertsCache
      }}
    >
      {children}
    </AlertsContext.Provider>
  );
};

export const useAlerts = () => {
  const context = useContext(AlertsContext);
  // Return an empty object with default values if context is not available
  // This prevents the "Cannot destructure property" error
  return context || { cacheAlert: () => {}, getCachedAlert: () => null, alertsCache: {} };
};