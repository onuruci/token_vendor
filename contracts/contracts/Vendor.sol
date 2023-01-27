// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract Vendor is Ownable {
  uint256 public ETHBalance;
  uint256 public tokenBalance;
  uint256 public tokenPerETH;
  address public tokenAddress;
  ERC20 public tokenContract;

  event Withdrawal(uint256 amount);
  event TokenBuy(uint256 amount, address _address);
  event TokenSell(uint256 amount, address _address);

  constructor(uint256 _tokenPerETH, address _tokenAddress) Ownable() {
    require(_tokenPerETH > 0, "Price is lower than zero");

    tokenPerETH = _tokenPerETH;
    tokenContract = ERC20(_tokenAddress);
  }

  function getETHBalance() public view returns(uint256) {
    return address(this).balance;
  }

  function getTokenbalance() public view returns(uint256) {
    return tokenContract.balanceOf(address(this));
  }

  function getTokenPerETH() public view returns(uint256) {
    return tokenPerETH;
  }

  function getTokenPrice() public view returns(uint256) {
    return (1/tokenPerETH);
  }
  
  function getTokenAddress() public view returns(address) {
    return tokenAddress;
  }

  function changeTokenPerETH(uint256 _price) public onlyOwner {
    tokenPerETH = _price;
  }

  // Token functionality

  function buyToken(uint256 _amount) external payable  {
    require(msg.value >= _amount / tokenPerETH , "Ether amount not sufficient");
    require(getTokenbalance() >= _amount, "Token amount on contract not sufficient");

    tokenContract.transfer(msg.sender, _amount);

    emit TokenBuy(_amount, msg.sender);
  }

  function sellToken(uint256 _amount) external payable {
    require(tokenContract.balanceOf(msg.sender) >= _amount, "Token Balance not sufficient");
    require(tokenContract.allowance(msg.sender, address(this)) >= _amount, "Allowed tokens are not sufficient");
    require(address(this).balance >= _amount / tokenPerETH, "ETH Balance is not sufficient on contract");

    tokenContract.transferFrom(msg.sender, address(this), _amount);

    emit TokenSell(_amount, msg.sender);
  }

  function withdraw() public payable onlyOwner {
    uint256 _balance = address(this).balance;
    (bool sent, ) = owner().call{value: address(this).balance}("");

    require(sent, "ETH transfer failed");
    if(!sent) {
      emit Withdrawal(_balance);
    }
  }

  receive() external payable {
    emit Withdrawal(msg.value);
  }

  fallback() external payable {
    emit Withdrawal(msg.value);
  }

}