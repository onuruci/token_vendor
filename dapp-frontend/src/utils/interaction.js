import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0xa6E3f2eD1b7bc000d8B775475508d08Cb4DC6453";
const VENDOR_ADDRESS = "0x9d702AeC5817d9AC174c2A9e843a06194172d0Fa";
const RPC_URL = "https://api.avax-test.network/ext/bc/C/rpc";
const ABI = require("./abi.json");
const VENDOR_ABI = require("./vendor_abi.json");
export var contract;
export var vendorContract;
export var signer;
export var provider;
export var walletAddress;
export var tokenBuyListener;

export const connectWallet = async (setAdress) => {
  if (window.ethereum) {
    await window.ethereum.enable();
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = await provider.getSigner();
    setAdress(await signer.getAddress());
    walletAddress = await signer.getAddress();

    contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    vendorContract = new ethers.Contract(VENDOR_ADDRESS, VENDOR_ABI, signer);
  } else {
    return "You should install metamask";
  }
};

export const getCurrentWalletConnected = async (setAdress) => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (addressArray.length > 0) {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = await provider.getSigner();
        walletAddress = await signer.getAddress();

        setAdress(walletAddress);
        contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
        vendorContract = new ethers.Contract(
          VENDOR_ADDRESS,
          VENDOR_ABI,
          signer
        );
      } else {
        return {
          address: "",
          status: "Connect Metamask",
        };
      }
    } catch (err) {
      return {
        address: "",
        status: "Error",
      };
    }
  } else {
    return {
      address: "",
      status: "Install Metamask",
    };
  }
};

export const getBalance = async (setBalance) => {
  var res = ethers.utils.formatEther(
    (await contract.balanceOf(walletAddress)).toString()
  );
  setBalance(res);
};

export const getVendorBalance = async (setVendorBalance) => {
  var res = ethers.utils.formatEther(
    (await vendorContract.getTokenbalance()).toString()
  );
  setVendorBalance(res);
};

export const getVendorAvaxBalance = async (setVendorAvaxBalance) => {
  var res = ethers.utils.formatEther(
    (await vendorContract.getETHBalance()).toString()
  );
  setVendorAvaxBalance(res);
};

export const buyTokens = async (tokenCount) => {
  const msgValue = tokenCount / 10;
  const options = { value: ethers.utils.parseEther(msgValue.toString()) };
  await vendorContract.buyToken(
    ethers.utils.parseEther(tokenCount.toString()),
    options
  );
};

export const tokenBuyListen = async (setSth) => {
  if (vendorContract) {
    vendorContract.on("TokenBuy", (amount, address) => {
      if (address.toString() == walletAddress) {
        setSth(ethers.utils.formatEther(amount.toString()));
        console.log("CAPTURED");
        console.log(ethers.utils.formatEther(amount.toString()));
      }
    });
  }
};
