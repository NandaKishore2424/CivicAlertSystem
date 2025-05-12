import React, { createContext, useContext, useState, useEffect } from 'react';
import web3Service from '../services/web3Service';
import { toast } from 'react-toastify';

const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [networkId, setNetworkId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGovernmentAuthority, setIsGovernmentAuthority] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Check if MetaMask is installed
    if (window.ethereum) {
      // Set up event listeners
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      
      // Initial connection
      connectWallet();
    } else {
      setLoading(false);
      toast.error("MetaMask is not installed. Please install MetaMask to use all features.");
    }
    
    return () => {
      // Clean up listeners when component unmounts
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);
  
  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      // User disconnected their wallet
      setAccount(null);
      setIsConnected(false);
      setIsGovernmentAuthority(false);
      setIsAdmin(false);
      toast.info("Wallet disconnected");
    } else {
      // User switched accounts
      setAccount(accounts[0]);
      checkUserRoles();
    }
  };
  
  const handleChainChanged = (chainId) => {
    // User switched networks
    setNetworkId(parseInt(chainId, 16));
    window.location.reload(); // Recommended by MetaMask
  };
  
  const connectWallet = async () => {
    try {
      setLoading(true);
      const result = await web3Service.init();
      
      setAccount(result.address);
      setNetworkId(result.networkId);
      setIsGovernmentAuthority(result.isGovernmentAuthority);
      setIsAdmin(result.isAdmin);
      setIsConnected(true);
      
      toast.success("Wallet connected successfully");
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast.error(`Failed to connect wallet: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const checkUserRoles = async () => {
    try {
      await web3Service.checkUserRoles();
      setIsGovernmentAuthority(web3Service.isGovernmentAuthority);
      setIsAdmin(web3Service.isAdmin);
    } catch (error) {
      console.error("Error checking user roles:", error);
    }
  };
  
  // Get alerts with pagination
  const getAlerts = async (offset = 0, limit = 10) => {
    try {
      return await web3Service.getAlerts(offset, limit);
    } catch (error) {
      console.error("Error fetching alerts:", error);
      toast.error(`Failed to fetch alerts: ${error.message}`);
      return [];
    }
  };
  
  // Get alert by ID
  const getAlertById = async (id) => {
    try {
      return await web3Service.getAlertById(id);
    } catch (error) {
      console.error(`Error fetching alert with ID ${id}:`, error);
      toast.error(`Failed to fetch alert: ${error.message}`);
      return null;
    }
  };
  
  // Create new alert (for government authorities)
  const createAlert = async (alertData) => {
    try {
      if (!isGovernmentAuthority) {
        toast.error("Only government authorities can create alerts");
        return null;
      }
      
      toast.info("Creating alert...", { autoClose: false, toastId: "creating-alert" });
      const result = await web3Service.createAlert(alertData);
      toast.dismiss("creating-alert");
      toast.success("Alert created successfully");
      
      return result;
    } catch (error) {
      console.error("Error creating alert:", error);
      toast.dismiss("creating-alert");
      toast.error(`Failed to create alert: ${error.message}`);
      return null;
    }
  };
  
  // Change alert status
  const changeAlertStatus = async (alertId, newStatus) => {
    try {
      if (!isGovernmentAuthority && !isAdmin) {
        toast.error("Only government authorities or admins can change alert status");
        return null;
      }
      
      toast.info("Updating alert status...");
      const result = await web3Service.changeAlertStatus(alertId, newStatus);
      toast.success("Alert status updated successfully");
      
      return result;
    } catch (error) {
      console.error("Error changing alert status:", error);
      toast.error(`Failed to update alert status: ${error.message}`);
      return null;
    }
  };
  
  // Get alert by QR code
  const getAlertByQrCode = async (qrCodeId) => {
    try {
      return await web3Service.getAlertByQrCode(qrCodeId);
    } catch (error) {
      console.error("Error fetching alert by QR code:", error);
      toast.error(`Failed to fetch alert from QR code: ${error.message}`);
      return null;
    }
  };
  
  // Add government authority (admin only)
  const addGovernmentAuthority = async (address) => {
    try {
      if (!isAdmin) {
        toast.error("Only admins can add government authorities");
        return null;
      }
      
      toast.info("Adding government authority...");
      const result = await web3Service.addGovernmentAuthority(address);
      toast.success("Government authority added successfully");
      
      return result;
    } catch (error) {
      console.error("Error adding government authority:", error);
      toast.error(`Failed to add authority: ${error.message}`);
      return null;
    }
  };
  
  // Remove government authority (admin only)
  const removeGovernmentAuthority = async (address) => {
    try {
      if (!isAdmin) {
        toast.error("Only admins can remove government authorities");
        return null;
      }
      
      toast.info("Removing government authority...");
      const result = await web3Service.removeGovernmentAuthority(address);
      toast.success("Government authority removed successfully");
      
      return result;
    } catch (error) {
      console.error("Error removing government authority:", error);
      toast.error(`Failed to remove authority: ${error.message}`);
      return null;
    }
  };
  
  const value = {
    account,
    networkId,
    loading,
    isGovernmentAuthority,
    isAdmin,
    isConnected,
    connectWallet,
    getAlerts,
    getAlertById,
    createAlert,
    changeAlertStatus,
    getAlertByQrCode,
    addGovernmentAuthority,
    removeGovernmentAuthority
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};