// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SimpleToken is ERC20 {
    // Constructor sets the name "Monorepo Token" and symbol "M-REPO"
    constructor() ERC20("Monorepo Token", "M-REPO") {
        // Mint 1,000,000 tokens to the deployer initially (optional)
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    /**
     * @dev Public mint function.
     * Allows any user to mint tokens to themselves.
     * In a real app, you might charge ETH for this.
     */
    function mint(uint256 amount) public {
        _mint(msg.sender, amount);
    }
    
    // NOTE: The 'transfer' function is already included in the ERC20 parent contract.
}