// import { ethers } from 'ethers';
// // import CivicAlertABI from '../contracts/CivicAlert.json';
// import IPFSStorageABI from '../contracts/IPFSStorage.json';
// import QRCodeManagerABI from '../contracts/QRCodeManager.json';
// import { create as ipfsHttpClient } from 'ipfs-http-client';

// // Contract addresses - these would be different based on deployment network
// const CIVIC_ALERT_ADDRESS = process.env.REACT_APP_CIVIC_ALERT_ADDRESS || "0x0000000000000000000000000000000000000000";
// const IPFS_STORAGE_ADDRESS = process.env.REACT_APP_IPFS_STORAGE_ADDRESS || "0x0000000000000000000000000000000000000000";
// const QR_CODE_MANAGER_ADDRESS = process.env.REACT_APP_QR_CODE_MANAGER_ADDRESS || "0x0000000000000000000000000000000000000000";

// // IPFS configuration with project id and secret (from Infura or similar service)
// const projectId = process.env.REACT_APP_IPFS_PROJECT_ID;
// const projectSecret = process.env.REACT_APP_IPFS_PROJECT_SECRET;
// const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

// const ipfsClient = ipfsHttpClient({
//   host: 'ipfs.infura.io',
//   port: 5001,
//   protocol: 'https',
//   headers: {
//     authorization: auth,
//   },
// });

// class Web3Service {
//   constructor() {
//     this.provider = null;
//     this.signer = null;
//     this.civicAlertContract = null;
//     this.ipfsStorageContract = null;
//     this.qrCodeManagerContract = null;
//     this.address = null;
//     this.networkId = null;
//     this.isGovernmentAuthority = false;
//     this.isAdmin = false;
//   }

//   /**
//    * Initialize connection to wallet and contracts
//    */
//   async init() {
//     try {
//       // Check if MetaMask is installed
//       if (window.ethereum) {
//         // Create Web3 provider using the injected provider
//         this.provider = new ethers.providers.Web3Provider(window.ethereum);
        
//         // Request account access if needed
//         await window.ethereum.request({ method: 'eth_requestAccounts' });
        
//         // Get the signer
//         this.signer = this.provider.getSigner();
        
//         // Get user address
//         this.address = await this.signer.getAddress();
        
//         // Get network ID
//         const network = await this.provider.getNetwork();
//         this.networkId = network.chainId;
        
//         // Initialize contracts
//         this.initContracts();
        
//         // Check roles
//         await this.checkUserRoles();
        
//         return {
//           address: this.address,
//           networkId: this.networkId,
//           isGovernmentAuthority: this.isGovernmentAuthority,
//           isAdmin: this.isAdmin
//         };
//       } else {
//         throw new Error("MetaMask is not installed");
//       }
//     } catch (error) {
//       console.error("Error initializing Web3:", error);
//       throw error;
//     }
//   }

//   /**
//    * Initialize contract instances
//    */
//   initContracts() {
//     this.civicAlertContract = new ethers.Contract(
//       CIVIC_ALERT_ADDRESS,
//       CivicAlertABI.abi,
//       this.signer
//     );
    
//     this.ipfsStorageContract = new ethers.Contract(
//       IPFS_STORAGE_ADDRESS,
//       IPFSStorageABI.abi,
//       this.signer
//     );
    
//     this.qrCodeManagerContract = new ethers.Contract(
//       QR_CODE_MANAGER_ADDRESS,
//       QRCodeManagerABI.abi,
//       this.signer
//     );
//   }

//   /**
//    * Check user roles (admin & government authority)
//    */
//   async checkUserRoles() {
//     try {
//       if (!this.civicAlertContract || !this.address) return;
      
//       const ADMIN_ROLE = await this.civicAlertContract.ADMIN_ROLE();
//       const GOVERNMENT_ROLE = await this.civicAlertContract.GOVERNMENT_ROLE();
      
//       this.isAdmin = await this.civicAlertContract.hasRole(ADMIN_ROLE, this.address);
//       this.isGovernmentAuthority = await this.civicAlertContract.hasRole(GOVERNMENT_ROLE, this.address);
//     } catch (error) {
//       console.error("Error checking user roles:", error);
//     }
//   }

//   /**
//    * Upload content to IPFS
//    * @param {Object} data - Data to upload to IPFS
//    * @returns {string} IPFS hash
//    */
//   async uploadToIPFS(data) {
//     try {
//       const jsonData = JSON.stringify(data);
//       const added = await ipfsClient.add(jsonData);
//       return added.path;
//     } catch (error) {
//       console.error("Error uploading to IPFS:", error);
//       throw error;
//     }
//   }

//   /**
//    * Fetch content from IPFS
//    * @param {string} ipfsHash - IPFS hash to fetch
//    * @returns {Object} Parsed JSON data
//    */
//   async fetchFromIPFS(ipfsHash) {
//     try {
//       const response = await fetch(`https://ipfs.io/ipfs/${ipfsHash}`);
//       return await response.json();
//     } catch (error) {
//       console.error("Error fetching from IPFS:", error);
//       throw error;
//     }
//   }

//   /**
//    * Create a new alert
//    * @param {Object} alertData - Alert data to create
//    * @returns {Object} Transaction receipt
//    */
//   async createAlert(alertData) {
//     try {
//       if (!this.isGovernmentAuthority) {
//         throw new Error("Only government authorities can create alerts");
//       }
      
//       // Upload detailed content to IPFS
//       const ipfsHash = await this.uploadToIPFS({
//         title: alertData.title,
//         description: alertData.description,
//         instructions: alertData.instructions,
//         additionalInfo: alertData.additionalInfo,
//         images: alertData.images,
//         documents: alertData.documents
//       });
      
//       // Convert geo coordinates to integers (multiplied by 10^6 for precision)
//       const latitude = Math.round(parseFloat(alertData.latitude) * 1000000);
//       const longitude = Math.round(parseFloat(alertData.longitude) * 1000000);
      
//       // Create alert on blockchain
//       const tx = await this.civicAlertContract.createAlert(
//         alertData.title,
//         alertData.location,
//         alertData.alertType, // Enum value (0: Emergency, 1: Warning, etc.)
//         ipfsHash,
//         latitude,
//         longitude
//       );
      
//       // Wait for transaction to be mined
//       const receipt = await tx.wait();
      
//       // Find the AlertCreated event
//       const event = receipt.events.find(e => e.event === "AlertCreated");
//       const alertId = event.args.id;
      
//       // Generate QR code if QR manager is available
//       let qrCodeId = null;
//       if (this.qrCodeManagerContract) {
//         const qrTx = await this.qrCodeManagerContract.generateQRCode(alertId);
//         const qrReceipt = await qrTx.wait();
//         const qrEvent = qrReceipt.events.find(e => e.event === "QRCodeGenerated");
//         qrCodeId = qrEvent.args.qrCodeId;
//       }
      
//       return {
//         alertId,
//         ipfsHash,
//         qrCodeId,
//         txHash: receipt.transactionHash
//       };
//     } catch (error) {
//       console.error("Error creating alert:", error);
//       throw error;
//     }
//   }

//   /**
//    * Get all alerts with pagination
//    * @param {number} offset - Starting index
//    * @param {number} limit - Maximum number of alerts to return
//    * @returns {Array} Array of alerts
//    */
//   async getAlerts(offset = 0, limit = 10) {
//     try {
//       const alerts = await this.civicAlertContract.getAlerts(offset, limit);
      
//       // Map blockchain data to more usable format
//       return Promise.all(alerts.map(async alert => {
//         // Convert latitude and longitude back to decimal (divided by 10^6)
//         const latitude = parseFloat(alert.latitude) / 1000000;
//         const longitude = parseFloat(alert.longitude) / 1000000;
        
//         // Get detailed content from IPFS if needed
//         let detailedContent = {};
//         try {
//           detailedContent = await this.fetchFromIPFS(alert.ipfsHash);
//         } catch (error) {
//           console.warn(`Failed to fetch IPFS content for alert ${alert.id}:`, error);
//         }
        
//         return {
//           id: alert.id.toString(),
//           title: alert.title,
//           location: alert.location,
//           type: this.getAlertTypeString(parseInt(alert.alertType)),
//           status: this.getAlertStatusString(parseInt(alert.status)),
//           ipfsHash: alert.ipfsHash,
//           issuer: alert.issuer,
//           timestamp: new Date(alert.timestamp * 1000).toISOString(),
//           qrCodeId: alert.qrCodeId,
//           latitude,
//           longitude,
//           details: detailedContent
//         };
//       }));
//     } catch (error) {
//       console.error("Error fetching alerts:", error);
//       throw error;
//     }
//   }

//   /**
//    * Get a single alert by ID
//    * @param {string|number} id - Alert ID
//    * @returns {Object} Alert data
//    */
//   async getAlertById(id) {
//     try {
//       const alert = await this.civicAlertContract.getAlertById(id);
      
//       // Convert latitude and longitude back to decimal
//       const latitude = parseFloat(alert.latitude) / 1000000;
//       const longitude = parseFloat(alert.longitude) / 1000000;
      
//       // Get detailed content from IPFS
//       let detailedContent = {};
//       try {
//         detailedContent = await this.fetchFromIPFS(alert.ipfsHash);
//       } catch (error) {
//         console.warn(`Failed to fetch IPFS content for alert ${id}:`, error);
//       }
      
//       return {
//         id: alert.id.toString(),
//         title: alert.title,
//         location: alert.location,
//         type: this.getAlertTypeString(parseInt(alert.alertType)),
//         status: this.getAlertStatusString(parseInt(alert.status)),
//         ipfsHash: alert.ipfsHash,
//         issuer: alert.issuer,
//         timestamp: new Date(alert.timestamp * 1000).toISOString(),
//         qrCodeId: alert.qrCodeId,
//         latitude,
//         longitude,
//         details: detailedContent
//       };
//     } catch (error) {
//       console.error(`Error fetching alert with ID ${id}:`, error);
//       throw error;
//     }
//   }

//   /**
//    * Get alert by QR code ID
//    * @param {string} qrCodeId - QR code ID (bytes32)
//    * @returns {Object} Alert data
//    */
//   async getAlertByQrCode(qrCodeId) {
//     try {
//       const alert = await this.civicAlertContract.getAlertByQrCode(qrCodeId);
//       return this.getAlertById(alert.id);
//     } catch (error) {
//       console.error("Error fetching alert by QR code:", error);
//       throw error;
//     }
//   }

//   /**
//    * Change alert status
//    * @param {string|number} alertId - Alert ID
//    * @param {number} newStatus - New status (0: Active, 1: Resolved, 2: Expired)
//    * @returns {Object} Transaction receipt
//    */
//   async changeAlertStatus(alertId, newStatus) {
//     try {
//       // Only government authority or admin can change status
//       if (!this.isGovernmentAuthority && !this.isAdmin) {
//         throw new Error("Only government authorities or admins can change alert status");
//       }
      
//       const tx = await this.civicAlertContract.changeAlertStatus(alertId, newStatus);
//       const receipt = await tx.wait();
      
//       return {
//         success: true,
//         txHash: receipt.transactionHash
//       };
//     } catch (error) {
//       console.error("Error changing alert status:", error);
//       throw error;
//     }
//   }

//   /**
//    * Add a government authority
//    * @param {string} address - Wallet address to add as authority
//    * @returns {Object} Transaction receipt
//    */
//   async addGovernmentAuthority(address) {
//     try {
//       if (!this.isAdmin) {
//         throw new Error("Only admins can add government authorities");
//       }
      
//       const tx = await this.civicAlertContract.addGovernmentAuthority(address);
//       const receipt = await tx.wait();
      
//       return {
//         success: true,
//         txHash: receipt.transactionHash
//       };
//     } catch (error) {
//       console.error("Error adding government authority:", error);
//       throw error;
//     }
//   }

//   /**
//    * Remove a government authority
//    * @param {string} address - Wallet address to remove as authority
//    * @returns {Object} Transaction receipt
//    */
//   async removeGovernmentAuthority(address) {
//     try {
//       if (!this.isAdmin) {
//         throw new Error("Only admins can remove government authorities");
//       }
      
//       const tx = await this.civicAlertContract.removeGovernmentAuthority(address);
//       const receipt = await tx.wait();
      
//       return {
//         success: true,
//         txHash: receipt.transactionHash
//       };
//     } catch (error) {
//       console.error("Error removing government authority:", error);
//       throw error;
//     }
//   }

//   /**
//    * Helper to convert alert type enum to string
//    * @param {number} typeValue - Enum value
//    * @returns {string} String representation
//    */
//   getAlertTypeString(typeValue) {
//     const types = ["Emergency", "Warning", "Info", "Safe"];
//     return types[typeValue] || "Unknown";
//   }

//   /**
//    * Helper to convert alert status enum to string
//    * @param {number} statusValue - Enum value
//    * @returns {string} String representation
//    */
//   getAlertStatusString(statusValue) {
//     const statuses = ["Active", "Resolved", "Expired"];
//     return statuses[statusValue] || "Unknown";
//   }
// }

// // Create singleton instance
// const web3Service = new Web3Service();

// export default web3Service;