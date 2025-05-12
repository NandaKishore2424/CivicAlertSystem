// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title CivicAlert
 * @dev A decentralized emergency alert system that allows authorized government entities
 * to publish verified emergency alerts on-chain with IPFS content storage.
 */
contract CivicAlert is AccessControl {
    using Counters for Counters.Counter;

    // Role definitions
    bytes32 public constant GOVERNMENT_ROLE = keccak256("GOVERNMENT_ROLE");
    bytes32 public constant ADMIN_ROLE = DEFAULT_ADMIN_ROLE; // OpenZeppelin's default admin role

    // Alert type enum
    enum AlertType { Emergency, Warning, Info, Safe }

    // Alert status enum
    enum AlertStatus { Active, Resolved, Expired }

    // Alert structure - optimized for on-chain storage with minimal data
    struct Alert {
        uint256 id;                // Unique identifier
        string title;              // Short title (keep it brief for gas efficiency)
        string location;           // Text-based location description
        AlertType alertType;       // Type of alert (from enum)
        AlertStatus status;        // Current status
        string ipfsHash;           // IPFS hash for detailed content
        address issuer;            // Wallet address that issued the alert
        uint256 timestamp;         // Block timestamp when created
        bytes32 qrCodeId;          // Unique QR code identifier
        int256 latitude;           // Location coordinates (latitude * 10^6)
        int256 longitude;          // Location coordinates (longitude * 10^6)
    }

    // Counter for alert IDs
    Counters.Counter private _alertIdCounter;

    // Mapping from ID to Alert
    mapping(uint256 => Alert) private _alerts;
    
    // Array to store all alert IDs
    uint256[] private _allAlertIds;
    
    // Mapping from QR code ID to alert ID
    mapping(bytes32 => uint256) private _qrCodeToAlertId;

    // Events
    event AlertCreated(uint256 indexed id, string title, AlertType alertType, address issuer, uint256 timestamp);
    event AlertStatusChanged(uint256 indexed id, AlertStatus newStatus, address changedBy);
    event GovernmentAuthorityAdded(address indexed authority, address addedBy);
    event GovernmentAuthorityRemoved(address indexed authority, address removedBy);

    /**
     * @dev Constructor sets up the admin role for the contract deployer
     */
    constructor() {
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    /**
     * @dev Create a new alert (only callable by government role)
     * @param title Short title of the alert
     * @param location Text description of affected location
     * @param alertType Type of alert from AlertType enum
     * @param ipfsHash IPFS hash containing detailed content
     * @param latitude Latitude coordinate (* 10^6 for precision)
     * @param longitude Longitude coordinate (* 10^6 for precision)
     * @return id The ID of the newly created alert
     */
    function createAlert(
        string memory title,
        string memory location,
        AlertType alertType,
        string memory ipfsHash,
        int256 latitude,
        int256 longitude
    ) public onlyRole(GOVERNMENT_ROLE) returns (uint256) {
        // Input validation
        require(bytes(title).length > 0, "Title cannot be empty");
        require(bytes(location).length > 0, "Location cannot be empty");
        require(bytes(ipfsHash).length > 0, "IPFS hash cannot be empty");

        // Generate unique ID
        _alertIdCounter.increment();
        uint256 newAlertId = _alertIdCounter.current();
        
        // Generate QR code ID (hash of alert ID and some random data)
        bytes32 qrCodeId = keccak256(abi.encodePacked(newAlertId, block.timestamp, msg.sender));
        
        // Create and store the alert
        Alert memory newAlert = Alert({
            id: newAlertId,
            title: title,
            location: location,
            alertType: alertType,
            status: AlertStatus.Active,
            ipfsHash: ipfsHash,
            issuer: msg.sender,
            timestamp: block.timestamp,
            qrCodeId: qrCodeId,
            latitude: latitude,
            longitude: longitude
        });
        
        _alerts[newAlertId] = newAlert;
        _allAlertIds.push(newAlertId);
        _qrCodeToAlertId[qrCodeId] = newAlertId;
        
        // Emit event
        emit AlertCreated(newAlertId, title, alertType, msg.sender, block.timestamp);
        
        return newAlertId;
    }

    /**
     * @dev Get an alert by its ID
     * @param alertId ID of the alert to retrieve
     * @return Alert structure
     */
    function getAlertById(uint256 alertId) public view returns (Alert memory) {
        require(_alerts[alertId].id != 0, "Alert does not exist");
        return _alerts[alertId];
    }
    
    /**
     * @dev Get an alert by QR code ID
     * @param qrCodeId QR code identifier
     * @return Alert structure
     */
    function getAlertByQrCode(bytes32 qrCodeId) public view returns (Alert memory) {
        uint256 alertId = _qrCodeToAlertId[qrCodeId];
        require(alertId != 0, "QR code not associated with any alert");
        return _alerts[alertId];
    }

    /**
     * @dev Get all alert IDs
     * @return Array of alert IDs
     */
    function getAllAlertIds() public view returns (uint256[] memory) {
        return _allAlertIds;
    }
    
    /**
     * @dev Get alerts with pagination
     * @param offset Starting index
     * @param limit Maximum number of alerts to return
     * @return Array of Alert structures
     */
    function getAlerts(uint256 offset, uint256 limit) public view returns (Alert[] memory) {
        uint256 totalAlerts = _allAlertIds.length;
        
        // Adjust limit if it exceeds the number of available alerts
        if (offset >= totalAlerts) {
            return new Alert[](0);
        }
        
        uint256 actualLimit = limit;
        if (offset + limit > totalAlerts) {
            actualLimit = totalAlerts - offset;
        }
        
        Alert[] memory result = new Alert[](actualLimit);
        for (uint256 i = 0; i < actualLimit; i++) {
            result[i] = _alerts[_allAlertIds[offset + i]];
        }
        
        return result;
    }
    
    /**
     * @dev Change alert status (only callable by the issuer or admin)
     * @param alertId ID of the alert
     * @param newStatus New status to set
     */
    function changeAlertStatus(uint256 alertId, AlertStatus newStatus) public {
        require(_alerts[alertId].id != 0, "Alert does not exist");
        require(
            hasRole(ADMIN_ROLE, msg.sender) || 
            _alerts[alertId].issuer == msg.sender, 
            "Caller is not authorized to change this alert"
        );
        
        _alerts[alertId].status = newStatus;
        emit AlertStatusChanged(alertId, newStatus, msg.sender);
    }
    
    /**
     * @dev Add a new government authority
     * @param authority Address to add as government authority
     */
    function addGovernmentAuthority(address authority) public onlyRole(ADMIN_ROLE) {
        require(authority != address(0), "Cannot add zero address as authority");
        grantRole(GOVERNMENT_ROLE, authority);
        emit GovernmentAuthorityAdded(authority, msg.sender);
    }
    
    /**
     * @dev Remove a government authority
     * @param authority Address to remove from government authority
     */
    function removeGovernmentAuthority(address authority) public onlyRole(ADMIN_ROLE) {
        revokeRole(GOVERNMENT_ROLE, authority);
        emit GovernmentAuthorityRemoved(authority, msg.sender);
    }
}