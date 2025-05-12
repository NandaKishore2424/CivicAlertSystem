const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CivicAlert", function () {
  let civicAlert;
  let ipfsStorage;
  let qrCodeManager;
  let owner;
  let govAuthority;
  let citizen;
  let GOVERNMENT_ROLE;
  let ADMIN_ROLE;

  beforeEach(async function () {
    // Get signers
    [owner, govAuthority, citizen] = await ethers.getSigners();
    
    // Deploy the QRCodeManager contract
    const QRCodeManager = await ethers.getContractFactory("QRCodeManager");
    qrCodeManager = await QRCodeManager.deploy();
    await qrCodeManager.deployed();
    
    // Deploy the IPFSStorage contract
    const IPFSStorage = await ethers.getContractFactory("IPFSStorage");
    ipfsStorage = await IPFSStorage.deploy();
    await ipfsStorage.deployed();
    
    // Deploy the main CivicAlert contract
    const CivicAlert = await ethers.getContractFactory("CivicAlert");
    civicAlert = await CivicAlert.deploy();
    await civicAlert.deployed();
    
    // Set up contract relationships
    await civicAlert.setIPFSStorage(ipfsStorage.address);
    await civicAlert.setQRCodeManager(qrCodeManager.address);
    await qrCodeManager.setCivicAlertContract(civicAlert.address);
    
    // Get the role hashes
    GOVERNMENT_ROLE = await civicAlert.GOVERNMENT_ROLE();
    ADMIN_ROLE = await civicAlert.ADMIN_ROLE();
    
    // Add government authority
    await civicAlert.addGovernmentAuthority(govAuthority.address);
  });

  describe("Role Management", function () {
    it("Should assign admin role to deployer", async function () {
      const ADMIN_ROLE = await civicAlert.ADMIN_ROLE();
      expect(await civicAlert.hasRole(ADMIN_ROLE, owner.address)).to.be.true;
    });
    
    it("Should add government authority", async function () {
      expect(await civicAlert.hasRole(GOVERNMENT_ROLE, govAuthority.address)).to.be.true;
    });
    
    it("Should remove government authority", async function () {
      await civicAlert.removeGovernmentAuthority(govAuthority.address);
      expect(await civicAlert.hasRole(GOVERNMENT_ROLE, govAuthority.address)).to.be.false;
    });
    
    it("Should not allow non-admin to add government authority", async function () {
      await expect(
        civicAlert.connect(citizen).addGovernmentAuthority(citizen.address)
      ).to.be.reverted;
    });
    
    it("Should not allow non-admins to remove government authority", async function () {
      await expect(
        civicAlert.connect(govAuthority).removeGovernmentAuthority(govAuthority.address)
      ).to.be.reverted;
    });
    
    it("Should verify admin can transfer admin role", async function () {
      await civicAlert.grantRole(ADMIN_ROLE, citizen.address);
      expect(await civicAlert.hasRole(ADMIN_ROLE, citizen.address)).to.be.true;
    });
  });
  
  describe("Alert Management", function () {
    it("Should create alert by government authority", async function () {
      const tx = await civicAlert.connect(govAuthority).createAlert(
        "Test Alert",
        "Test Location",
        0, // AlertType.Emergency
        "QmTestIPFSHash",
        40123456, // Latitude (multiplied by 10^6)
        -74123456 // Longitude (multiplied by 10^6)
      );
      
      const receipt = await tx.wait();
      const event = receipt.events.find(e => e.event === "AlertCreated");
      expect(event).to.not.be.undefined;
      
      const alertId = event.args.id;
      const alert = await civicAlert.getAlertById(alertId);
      
      expect(alert.title).to.equal("Test Alert");
      expect(alert.location).to.equal("Test Location");
      expect(alert.alertType).to.equal(0); // AlertType.Emergency
      expect(alert.ipfsHash).to.equal("QmTestIPFSHash");
      expect(alert.issuer).to.equal(govAuthority.address);
    });
    
    it("Should not allow citizens to create alerts", async function () {
      await expect(
        civicAlert.connect(citizen).createAlert(
          "Test Alert",
          "Test Location",
          0,
          "QmTestIPFSHash",
          40123456,
          -74123456
        )
      ).to.be.reverted;
    });
    
    it("Should change alert status", async function () {
      const tx = await civicAlert.connect(govAuthority).createAlert(
        "Test Alert",
        "Test Location",
        0,
        "QmTestIPFSHash",
        40123456,
        -74123456
      );
      
      const receipt = await tx.wait();
      const event = receipt.events.find(e => e.event === "AlertCreated");
      const alertId = event.args.id;
      
      await civicAlert.connect(govAuthority).changeAlertStatus(alertId, 1); // AlertStatus.Resolved
      
      const alert = await civicAlert.getAlertById(alertId);
      expect(alert.status).to.equal(1); // AlertStatus.Resolved
    });
    
    it("Should retrieve alerts with pagination", async function () {
      // Create multiple alerts
      for (let i = 0; i < 5; i++) {
        await civicAlert.connect(govAuthority).createAlert(
          `Test Alert ${i}`,
          `Test Location ${i}`,
          0,
          `QmTestIPFSHash${i}`,
          40123456,
          -74123456
        );
      }
      
      // Get alerts with pagination
      const alerts = await civicAlert.getAlerts(1, 3);
      
      expect(alerts.length).to.equal(3);
      expect(alerts[0].title).to.equal("Test Alert 1");
      expect(alerts[1].title).to.equal("Test Alert 2");
      expect(alerts[2].title).to.equal("Test Alert 3");
    });
    
    it("Should emit proper events when creating alert", async function () {
      await expect(civicAlert.connect(govAuthority).createAlert(
        "Test Alert",
        "Test Location",
        0, // AlertType.Emergency
        "QmTestIPFSHash",
        40123456,
        -74123456
      )).to.emit(civicAlert, "AlertCreated");
    });
    
    it("Should store and retrieve accurate alert data", async function () {
      const tx = await civicAlert.connect(govAuthority).createAlert(
        "Detailed Alert",
        "Test City",
        1, // AlertType.Warning
        "QmTestIPFSHash123",
        40123456,
        -74123456
      );
      
      const receipt = await tx.wait();
      const event = receipt.events.find(e => e.event === "AlertCreated");
      const alertId = event.args.id;
      
      const alert = await civicAlert.getAlertById(alertId);
      
      // Check all alert fields
      expect(alert.title).to.equal("Detailed Alert");
      expect(alert.location).to.equal("Test City");
      expect(alert.alertType).to.equal(1); // Warning
      expect(alert.status).to.equal(0); // Active
      expect(alert.ipfsHash).to.equal("QmTestIPFSHash123");
      expect(alert.issuer).to.equal(govAuthority.address);
      expect(alert.latitude).to.equal(40123456);
      expect(alert.longitude).to.equal(-74123456);
    });
  });
  
  describe("QR Code Integration", function () {
    it("Should generate QR code for alert", async function () {
      // Create alert
      const tx = await civicAlert.connect(govAuthority).createAlert(
        "QR Test Alert",
        "Test Location",
        0,
        "QmTestIPFSHash",
        40123456,
        -74123456
      );
      
      const receipt = await tx.wait();
      const event = receipt.events.find(e => e.event === "AlertCreated");
      const alertId = event.args.id;
      
      // Check that QR code was generated
      const alert = await civicAlert.getAlertById(alertId);
      expect(alert.qrCodeId).to.not.be.null;
      expect(alert.qrCodeId).to.not.equal("0x0000000000000000000000000000000000000000000000000000000000000000");
      
      // Lookup alert by QR code
      const alertIdByQR = await qrCodeManager.getAlertIdByQRCode(alert.qrCodeId);
      expect(alertIdByQR).to.equal(alertId);
    });
  });
  
  describe("IPFS Storage Integration", function () {
    it("Should store and retrieve attachments", async function () {
      // Create alert first
      const tx = await civicAlert.connect(govAuthority).createAlert(
        "IPFS Test Alert",
        "Test Location",
        0,
        "QmMainContentHash",
        40123456,
        -74123456
      );
      
      const receipt = await tx.wait();
      const event = receipt.events.find(e => e.event === "AlertCreated");
      const alertId = event.args.id;
      
      // Add attachment
      await ipfsStorage.connect(govAuthority).addAttachment(
        alertId,
        "image",
        "QmImageHash"
      );
      
      // Retrieve attachments
      const attachments = await ipfsStorage.getAttachments(alertId);
      expect(attachments.length).to.equal(1);
      expect(attachments[0].attachmentType).to.equal("image");
      expect(attachments[0].ipfsHash).to.equal("QmImageHash");
    });
  });
  
  describe("Gas Usage Optimization", function () {
    it("Should measure gas usage for alert creation", async function () {
      const tx = await civicAlert.connect(govAuthority).createAlert(
        "Gas Test",
        "Test Location",
        0,
        "QmTestIPFSHash",
        40123456,
        -74123456
      );
      
      const receipt = await tx.wait();
      
      // Log gas used
      console.log(`Gas used for alert creation: ${receipt.gasUsed.toString()}`);
      
      // Could add assertions here if you want to enforce gas limits
      expect(receipt.gasUsed).to.be.lessThan(500000); // Example gas limit
    });
  });
});