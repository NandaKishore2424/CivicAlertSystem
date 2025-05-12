// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title QRCodeManager
 * @dev Manages QR codes for emergency alerts
 */
contract QRCodeManager is AccessControl {
    bytes32 public constant GOVERNMENT_ROLE = keccak256("GOVERNMENT_ROLE");
    bytes32 public constant ADMIN_ROLE = DEFAULT_ADMIN_ROLE;
    
    // Structure for QR code data
    struct QRCodeData {
        uint256 alertId;
        bytes32 uniqueId;
        address issuer;
        uint256 createdAt;
        bool isValid;
    }
    
    // Mapping from QR code ID to data
    mapping(bytes32 => QRCodeData) private _qrCodeData;
    
    // Event emitted when a QR code is generated
    event QRCodeGenerated(bytes32 indexed qrCodeId, uint256 alertId, address issuer);
    
    /**
     * @dev Constructor sets up the admin role for the contract deployer
     */
    constructor() {
        _grantRole(ADMIN_ROLE, msg.sender);
    }
    
    /**
     * @dev Generate a QR code for an alert
     * @param alertId ID of the alert
     * @return qrCodeId Unique ID for the QR code
     */
    function generateQRCode(uint256 alertId) public onlyRole(GOVERNMENT_ROLE) returns (bytes32) {
        bytes32 qrCodeId = keccak256(abi.encodePacked(alertId, block.timestamp, msg.sender));
        
        QRCodeData memory newQRCode = QRCodeData({
            alertId: alertId,
            uniqueId: qrCodeId,
            issuer: msg.sender,
            createdAt: block.timestamp,
            isValid: true
        });
        
        _qrCodeData[qrCodeId] = newQRCode;
        
        emit QRCodeGenerated(qrCodeId, alertId, msg.sender);
        
        return qrCodeId;
    }
    
    /**
     * @dev Validate a QR code
     * @param qrCodeId ID of the QR code to validate
     * @return bool True if QR code is valid
     * @return uint256 Alert ID associated with the QR code
     */
    function validateQRCode(bytes32 qrCodeId) public view returns (bool, uint256) {
        QRCodeData memory data = _qrCodeData[qrCodeId];
        return (data.isValid, data.alertId);
    }
    
    /**
     * @dev Invalidate a QR code (e.g., for expired alerts)
     * @param qrCodeId ID of the QR code to invalidate
     */
    function invalidateQRCode(bytes32 qrCodeId) public onlyRole(GOVERNMENT_ROLE) {
        require(_qrCodeData[qrCodeId].alertId != 0, "QR code does not exist");
        require(_qrCodeData[qrCodeId].issuer == msg.sender || hasRole(ADMIN_ROLE, msg.sender), 
                "Not authorized to invalidate this QR code");
                
        _qrCodeData[qrCodeId].isValid = false;
    }
}