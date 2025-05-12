// import React, {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   useCallback,
// } from 'react';
// import web3Service from '../services/web3Service';
// import { toast } from 'react-toastify';

// const Web3Context = createContext();

// export const Web3Provider = ({ children }) => {
//   const [account, setAccount] = useState(null);
//   const [networkId, setNetworkId] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isGovernmentAuthority, setIsGovernmentAuthority] = useState(false);
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [isConnected, setIsConnected] = useState(false);

//   const checkUserRoles = useCallback(async () => {
//     try {
//       const roles = await web3Service.checkUserRoles();
//       setIsGovernmentAuthority(roles?.isGovernmentAuthority || false);
//       setIsAdmin(roles?.isAdmin || false);
//     } catch (error) {
//       console.error("Error checking user roles:", error);
//     }
//   }, []);

//   const handleAccountsChanged = useCallback(
//     async (accounts) => {
//       if (!accounts || accounts.length === 0) {
//         setAccount(null);
//         setIsConnected(false);
//         setIsGovernmentAuthority(false);
//         setIsAdmin(false);
//         toast.info("Wallet disconnected");
//       } else {
//         setAccount(accounts[0]);
//         setIsConnected(true);
//         await checkUserRoles();
//       }
//     },
//     [checkUserRoles]
//   );

//   const handleChainChanged = useCallback((chainId) => {
//     setNetworkId(parseInt(chainId, 16));
//     window.location.reload();
//   }, []);

//   const connectWallet = useCallback(async () => {
//     try {
//       setLoading(true);
//       const result = await web3Service.init();

//       if (result) {
//         setAccount(result.address);
//         setNetworkId(result.networkId);
//         setIsGovernmentAuthority(result.isGovernmentAuthority || false);
//         setIsAdmin(result.isAdmin || false);
//         setIsConnected(true);
//         toast.success("Wallet connected successfully");
//       }
//     } catch (error) {
//       console.error("Error connecting wallet:", error);
//       toast.error(`Failed to connect wallet: ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     if (window.ethereum) {
//       window.ethereum.on('accountsChanged', handleAccountsChanged);
//       window.ethereum.on('chainChanged', handleChainChanged);
//       connectWallet();
//     } else {
//       toast.error("MetaMask is not installed. Please install MetaMask.");
//       setLoading(false);
//     }

//     return () => {
//       if (window.ethereum) {
//         window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
//         window.ethereum.removeListener('chainChanged', handleChainChanged);
//       }
//     };
//   }, [connectWallet, handleAccountsChanged, handleChainChanged]);

//   const getAlerts = async (offset = 0, limit = 10) => {
//     try {
//       return await web3Service.getAlerts(offset, limit);
//     } catch (error) {
//       console.error("Error fetching alerts:", error);
//       toast.error(`Failed to fetch alerts: ${error.message}`);
//       return [];
//     }
//   };

//   const getAlertById = async (id) => {
//     try {
//       return await web3Service.getAlertById(id);
//     } catch (error) {
//       console.error(`Error fetching alert ${id}:`, error);
//       toast.error(`Failed to fetch alert: ${error.message}`);
//       return null;
//     }
//   };

//   const createAlert = async (alertData) => {
//     if (!isGovernmentAuthority) {
//       toast.error("Only government authorities can create alerts");
//       return null;
//     }

//     try {
//       toast.info("Creating alert...", { autoClose: false, toastId: "creating-alert" });
//       const result = await web3Service.createAlert(alertData);
//       toast.dismiss("creating-alert");
//       toast.success("Alert created successfully");
//       return result;
//     } catch (error) {
//       toast.dismiss("creating-alert");
//       console.error("Error creating alert:", error);
//       toast.error(`Failed to create alert: ${error.message}`);
//       return null;
//     }
//   };

//   const changeAlertStatus = async (alertId, newStatus) => {
//     if (!isGovernmentAuthority && !isAdmin) {
//       toast.error("Only authorities or admins can change alert status");
//       return null;
//     }

//     try {
//       toast.info("Updating alert status...");
//       const result = await web3Service.changeAlertStatus(alertId, newStatus);
//       toast.success("Alert status updated successfully");
//       return result;
//     } catch (error) {
//       console.error("Error changing alert status:", error);
//       toast.error(`Failed to update alert status: ${error.message}`);
//       return null;
//     }
//   };

//   const getAlertByQrCode = async (qrCodeId) => {
//     try {
//       return await web3Service.getAlertByQrCode(qrCodeId);
//     } catch (error) {
//       console.error("Error fetching alert by QR code:", error);
//       toast.error(`Failed to fetch alert: ${error.message}`);
//       return null;
//     }
//   };

//   const addGovernmentAuthority = async (address) => {
//     if (!isAdmin) {
//       toast.error("Only admins can add government authorities");
//       return null;
//     }

//     try {
//       toast.info("Adding government authority...");
//       const result = await web3Service.addGovernmentAuthority(address);
//       toast.success("Government authority added successfully");
//       return result;
//     } catch (error) {
//       console.error("Error adding authority:", error);
//       toast.error(`Failed to add authority: ${error.message}`);
//       return null;
//     }
//   };

//   const removeGovernmentAuthority = async (address) => {
//     if (!isAdmin) {
//       toast.error("Only admins can remove government authorities");
//       return null;
//     }

//     try {
//       toast.info("Removing government authority...");
//       const result = await web3Service.removeGovernmentAuthority(address);
//       toast.success("Government authority removed successfully");
//       return result;
//     } catch (error) {
//       console.error("Error removing authority:", error);
//       toast.error(`Failed to remove authority: ${error.message}`);
//       return null;
//     }
//   };

//   const value = {
//     account,
//     networkId,
//     loading,
//     isGovernmentAuthority,
//     isAdmin,
//     isConnected,
//     connectWallet,
//     getAlerts,
//     getAlertById,
//     createAlert,
//     changeAlertStatus,
//     getAlertByQrCode,
//     addGovernmentAuthority,
//     removeGovernmentAuthority,
//   };

//   return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
// };

// export const useWeb3 = () => {
//   const context = useContext(Web3Context);
//   if (!context) {
//     throw new Error('useWeb3 must be used within a Web3Provider');
//   }
//   return context;
// };
