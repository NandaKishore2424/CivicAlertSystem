const { ethers } = require("hardhat");

async function main() {
  console.log("Starting deployment process...");
  
  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  
  // Deploy QRCodeManager
  console.log("Deploying QRCodeManager...");
  const QRCodeManager = await ethers.getContractFactory("QRCodeManager");
  const qrCodeManager = await QRCodeManager.deploy();
  await qrCodeManager.deployed();
  console.log("QRCodeManager deployed to:", qrCodeManager.address);
  
  // Deploy IPFSStorage
  console.log("Deploying IPFSStorage...");
  const IPFSStorage = await ethers.getContractFactory("IPFSStorage");
  const ipfsStorage = await IPFSStorage.deploy();
  await ipfsStorage.deployed();
  console.log("IPFSStorage deployed to:", ipfsStorage.address);
  
  // Deploy CivicAlert
  console.log("Deploying CivicAlert...");
  const CivicAlert = await ethers.getContractFactory("CivicAlert");
  const civicAlert = await CivicAlert.deploy();
  await civicAlert.deployed();
  console.log("CivicAlert deployed to:", civicAlert.address);
  
  // Set up contract relationships
  console.log("Setting up contract relationships...");
  await civicAlert.setIPFSStorage(ipfsStorage.address);
  await civicAlert.setQRCodeManager(qrCodeManager.address);
  await qrCodeManager.setCivicAlertContract(civicAlert.address);
  console.log("Contract relationships set up successfully");
  
  // Save deployment information
  console.log("\nDeployment Summary:");
  console.log("-------------------");
  console.log("CivicAlert:    ", civicAlert.address);
  console.log("IPFSStorage:   ", ipfsStorage.address);
  console.log("QRCodeManager: ", qrCodeManager.address);
  
  // Write to a deployment file for easy reference
  const fs = require("fs");
  const deploymentInfo = {
    civicAlert: civicAlert.address,
    ipfsStorage: ipfsStorage.address,
    qrCodeManager: qrCodeManager.address,
    network: network.name,
    timestamp: new Date().toISOString()
  };
  
  fs.writeFileSync(
    "deployment-info.json",
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("Deployment information saved to deployment-info.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });