// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract REVOToken is ERC20 {
    constructor() ERC20("RevoToken", "REVO") {
        _mint(msg.sender, 1000000 * (10 ** 18));
    }
}
