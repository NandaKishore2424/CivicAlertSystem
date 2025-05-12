const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Starting deployment process...");
  
  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());
  
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
  
  // Set up contract relationships (assuming these functions exist)
  console.log("Setting up contract relationships...");
  
  // Export ABIs for frontend and backend use
  const deploymentInfo = {
    network: network.name,
    civicAlert: {
      address: civicAlert.address,
      abi: JSON.parse(civicAlert.interface.format('json'))
    },
    ipfsStorage: {
      address: ipfsStorage.address,
      abi: JSON.parse(ipfsStorage.interface.format('json'))
    },
    qrCodeManager: {
      address: qrCodeManager.address,
      abi: JSON.parse(qrCodeManager.interface.format('json'))
    }
  };
  
  // Ensure the directory exists
  const contractsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }
  
  // Write deployment info and ABIs
  fs.writeFileSync(
    path.join(contractsDir, "deployment.json"),
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("Deployment information saved to deployments/deployment.json");
  
  // Also save contracts for the frontend
  const frontendDir = path.join(__dirname, "..", "..", "frontend", "src", "contracts");
  if (!fs.existsSync(frontendDir)) {
    fs.mkdirSync(frontendDir, { recursive: true });
  }
  
  fs.writeFileSync(
    path.join(frontendDir, "CivicAlert.json"),
    JSON.stringify({ 
      address: civicAlert.address, 
      abi: deploymentInfo.civicAlert.abi 
    }, null, 2)
  );
  
  fs.writeFileSync(
    path.join(frontendDir, "IPFSStorage.json"),
    JSON.stringify({ 
      address: ipfsStorage.address, 
      abi: deploymentInfo.ipfsStorage.abi 
    }, null, 2)
  );
  
  fs.writeFileSync(
    path.join(frontendDir, "QRCodeManager.json"),
    JSON.stringify({ 
      address: qrCodeManager.address, 
      abi: deploymentInfo.qrCodeManager.abi 
    }, null, 2)
  );
  
  console.log("Contract files generated for frontend!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });