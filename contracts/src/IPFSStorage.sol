// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title IPFSStorage
 * @dev Helper contract to manage IPFS hashes for alerts
 * This primarily serves as an on-chain registry for IPFS content
 */
contract IPFSStorage is AccessControl {
    bytes32 public constant GOVERNMENT_ROLE = keccak256("GOVERNMENT_ROLE");
    bytes32 public constant ADMIN_ROLE = DEFAULT_ADMIN_ROLE;
    
    // Mapping from alert ID to IPFS hash
    mapping(uint256 => string) private _alertContent;
    
    // Mapping from alert ID to additional IPFS resources (images, PDFs, etc)
    mapping(uint256 => string[]) private _alertAttachments;
    
    // Event emitted when content is added
    event ContentAdded(uint256 indexed alertId, string ipfsHash, address addedBy);
    event AttachmentAdded(uint256 indexed alertId, string ipfsHash, address addedBy);
    
    /**
     * @dev Constructor sets up the admin role for the contract deployer
     */
    constructor() {
        _grantRole(ADMIN_ROLE, msg.sender);
    }
    
    /**
     * @dev Store main content IPFS hash for an alert
     * @param alertId ID of the alert
     * @param ipfsHash IPFS hash of the content
     */
    function storeContent(uint256 alertId, string memory ipfsHash) public onlyRole(GOVERNMENT_ROLE) {
        require(bytes(ipfsHash).length > 0, "IPFS hash cannot be empty");
        _alertContent[alertId] = ipfsHash;
        emit ContentAdded(alertId, ipfsHash, msg.sender);
    }
    
    /**
     * @dev Add an attachment IPFS hash for an alert
     * @param alertId ID of the alert
     * @param ipfsHash IPFS hash of the attachment
     */
    function addAttachment(uint256 alertId, string memory ipfsHash) public onlyRole(GOVERNMENT_ROLE) {
        require(bytes(ipfsHash).length > 0, "IPFS hash cannot be empty");
        _alertAttachments[alertId].push(ipfsHash);
        emit AttachmentAdded(alertId, ipfsHash, msg.sender);
    }
    
    /**
     * @dev Get the main content IPFS hash for an alert
     * @param alertId ID of the alert
     * @return IPFS hash
     */
    function getContent(uint256 alertId) public view returns (string memory) {
        return _alertContent[alertId];
    }
    
    /**
     * @dev Get all attachment IPFS hashes for an alert
     * @param alertId ID of the alert
     * @return Array of IPFS hashes
     */
    function getAttachments(uint256 alertId) public view returns (string[] memory) {
        return _alertAttachments[alertId];
    }
}