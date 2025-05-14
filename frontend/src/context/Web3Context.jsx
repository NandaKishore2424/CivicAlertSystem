import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import web3Service from '../services/web3Service';
import { toast } from 'react-toastify';

const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [networkId, setNetworkId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isGovernmentAuthority, setIsGovernmentAuthority] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false); // Flag to prevent duplicate connection requests

  const checkUserRoles = useCallback(async () => {
    try {
      if (!web3Service || !web3Service.address) return;
      
      const roles = await web3Service.checkUserRoles();
      setIsGovernmentAuthority(roles?.isGovernmentAuthority || false);
      setIsAdmin(roles?.isAdmin || false);
    } catch (error) {
      console.error("Error checking user roles:", error);
    }
  }, []);

  const handleAccountsChanged = useCallback(async (accounts) => {
    if (!accounts || accounts.length === 0) {
      setAccount(null);
      setIsConnected(false);
      setIsGovernmentAuthority(false);
      setIsAdmin(false);
      toast.info("Wallet disconnected");
    } else {
      setAccount(accounts[0]);
      setIsConnected(true);
      await checkUserRoles();
    }
  }, [checkUserRoles]);

  const handleChainChanged = useCallback((chainId) => {
    setNetworkId(parseInt(chainId, 16));
    window.location.reload();
  }, []);

  // Update the connectWallet function

const connectWallet = useCallback(async () => {
  // Prevent multiple simultaneous connection attempts
  if (isConnecting) {
    toast.info("Connection already in progress, please check your wallet extension");
    return;
  }
  
  try {
    setIsConnecting(true);
    setLoading(true);
    
    // Check if MetaMask is installed
    if (!window.ethereum) {
      toast.error("MetaMask is not installed. Please install MetaMask to connect.");
      throw new Error("MetaMask is not installed");
    }

    // Check for pending requests and clear them if possible
    try {
      // This tries to clear any pending requests
      await window.ethereum.request({
        method: 'wallet_requestPermissions',
        params: [{ eth_accounts: {} }],
      }).catch(error => {
        // If there's a pending request error, we'll handle it differently
        if (error.message.includes("already pending")) {
          toast.warn("A connection request is already pending. Please check your MetaMask extension and complete or reject it.");
          throw new Error("Connection request already pending");
        }
        // For other errors, we'll continue with initialization
      });
    } catch (error) {
      if (error.message === "Connection request already pending") {
        // This is our custom error indicating a pending request
        setIsConnecting(false);
        setLoading(false);
        return; // Exit early
      }
      // For other errors, continue trying to connect
    }

    // Normal initialization flow
    const result = await web3Service.init();
      
    if (result) {
      setAccount(result.address);
      setNetworkId(result.networkId);
      setIsGovernmentAuthority(result.isGovernmentAuthority || false);
      setIsAdmin(result.isAdmin || false);
      setIsConnected(true);
      
      // Remember the connection
      localStorage.setItem('isWalletConnected', 'true');
      
      toast.success("Wallet connected successfully");
    }
  } catch (error) {
    console.error("Error connecting wallet:", error);
    
    // Handle specific error types
    if (error.message.includes("already pending")) {
      toast.error("Connection request already pending. Check your MetaMask extension.");
    } else if (error.code === 4001) {
      toast.error("Connection rejected. Please try again.");
    } else {
      toast.error(`Connection failed: ${error.message}`);
    }
    
    // Clear the stored connection status on error
    localStorage.removeItem('isWalletConnected');
  } finally {
    setLoading(false);
    // Add a delay before allowing new connection attempts
    setTimeout(() => {
      setIsConnecting(false);
    }, 1000);
  }
}, [isConnecting, web3Service]);

  // Safe method wrappers that check for web3Service before calling
  const getAlerts = async (offset = 0, limit = 10) => {
    try {
      if (!web3Service || !web3Service.getAlerts) 
        return [];
      return await web3Service.getAlerts(offset, limit);
    } catch (error) {
      console.error("Error fetching alerts:", error);
      toast.error(`Failed to fetch alerts: ${error.message}`);
      return [];
    }
  };

  const getAlertById = async (id) => {
    try {
      if (!web3Service || !web3Service.getAlertById)
        throw new Error("Web3 service not initialized");
      return await web3Service.getAlertById(id);
    } catch (error) {
      console.error(`Error fetching alert ${id}:`, error);
      toast.error(`Failed to fetch alert: ${error.message}`);
      return null;
    }
  };

  // Mock implementation for demo purposes
  const getDemoAlert = (id) => {
    const demoAlerts = [
      {
        id: "demo-1",
        title: "Flash Flood Warning",
        alertType: 0,
        description: "Heavy rainfall has caused flash flooding in low-lying areas.",
        location: "Chennai Central",
        timestamp: Date.now() - 1000 * 60 * 30,
        latitude: 13.083,
        longitude: 80.278,
        status: 0
      },
      // Add other demo alerts here if needed
    ];
    
    return demoAlerts.find(alert => alert.id === id);
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      
      // Check if user was previously connected
      const wasConnected = localStorage.getItem('isWalletConnected') === 'true';
      
      // Auto-connect if they were previously connected
      if (wasConnected) {
        connectWallet();
      } else {
        setLoading(false);
      }
    } else {
      console.warn("MetaMask is not installed");
      setLoading(false);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [connectWallet, handleAccountsChanged, handleChainChanged]);

  const value = {
    account,
    networkId,
    loading,
    isGovernmentAuthority,
    isAdmin,
    isConnected,
    connectWallet,
    getAlerts,
    getAlertById: id => id.startsWith('demo-') ? getDemoAlert(id) : getAlertById(id),
    // Add other methods here
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};
