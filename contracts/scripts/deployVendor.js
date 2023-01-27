// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const Vendor = await hre.ethers.getContractFactory("Vendor");
  const vendor = await Vendor.deploy(
    10,
    ethers.utils.hexlify("0xa6e3f2ed1b7bc000d8b775475508d08cb4dc6453")
  );

  const rev = await vendor.deployed();

  console.log(`Vendor contract deployed to ${vendor.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
