import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from './Web3Context';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const { account, isConnected, isGovernmentAuthority, isAdmin } = useWeb3();
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState(null); // 'user' or 'official'

  // Wrap logout in useCallback
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    setToken(null);
    setCurrentUser(null);
    setUserType(null);
    toast.info('Logged out successfully');
    navigate('/');
  }, [navigate]);

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUserType = localStorage.getItem('userType');
      
      if (storedToken) {
        setToken(storedToken);
        setUserType(storedUserType || 'user');
        try {
          setCurrentUser({ isLoggedIn: true, type: storedUserType || 'user' });
        } catch (error) {
          logout();
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, [logout]);

  // Also check Web3 wallet connection
  useEffect(() => {
    if (isConnected && account) {
      // User connected via wallet - can handle differently if needed
    }
  }, [isConnected, account]);
  
  // Determine if user has access to government features
  // Now using the values from useWeb3() that were called at the component level
  const hasGovernmentAccess = () => {
    return (
      (currentUser && currentUser.type === 'official') || 
      isGovernmentAuthority || 
      isAdmin
    );
  };

  return (
    <AuthContext.Provider 
      value={{
        currentUser,
        token,
        userType,
        loading,
        isAuthenticated: !!token || isConnected,
        logout,
        hasGovernmentAccess
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);