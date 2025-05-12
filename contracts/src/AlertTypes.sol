// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title AlertTypes
 * @dev Library of constants and types used in the CivicAlert system
 */
library AlertTypes {
    // Alert categories 
    enum Category { 
        Health,       // Health crises, disease outbreaks
        Environmental,// Natural disasters, weather events 
        Civil,        // Civil unrest, riots
        War,          // Armed conflicts, terrorism
        Infrastructure// Infrastructure failures, power outages
    }
    
    // Alert severity levels
    enum Severity {
        Critical,     // Immediate life-threatening danger
        Warning,      // High potential for harm
        Advisory,     // Important but not immediately dangerous
        Informational // General public information
    }
    
    // Alert range (geographic scope)
    enum Range {
        National,     // Entire country
        Regional,     // State/province level
        City,         // City-wide
        Local         // Neighborhood/limited area
    }
}