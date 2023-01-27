const { expect } = require("chai");
const { ethers } = require("hardhat");
describe("REVOToken", function () {
  var owner, account1, account2;
  var revoToken;
  var ownerContract, acc1Connection, acc2Connection;
  const ONE_GWEI = 1_000_000_000;

  async function deployContracts() {
    // Contracts are deployed using the first signer/account by default
    [owner, account1, account2] = await ethers.getSigners();

    const REVOTokenFactory = await ethers.getContractFactory("REVOToken");
    revoToken = await REVOTokenFactory.deploy();

    const VendorFactory = await ethers.getContractFactory("Vendor");
    vendorContract = await VendorFactory.deploy(10, revoToken.address);
  }

  this.beforeAll(async () => {
    await deployContracts();
  });

  describe("Token Contract", function () {
    it("Should assign 1M to owner", async function () {
      let resString = (await revoToken.balanceOf(owner.address)).toString();

      let testInt = 1;
      for (let i = 0; i < 24; i++) {
        testInt += "0";
      }

      expect(resString).to.equal(testInt);
    });
  });

  describe("Vendor", function () {
    this.beforeAll(async () => {
      await revoToken.transfer(vendorContract.address, ONE_GWEI);
    });

    it("Should contain ONE_GWEI tokens", async function () {
      expect(await revoToken.balanceOf(vendorContract.address)).to.equal(
        ONE_GWEI
      );
    });
  });
});
