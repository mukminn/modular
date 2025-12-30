// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

interface IOpenChainHub2 {
    enum ActionType {
        Mint,
        Burn,
        Transfer,
        Faucet
    }

    function log(
        address user,
        address actor,
        address target,
        ActionType action,
        uint256 amount,
        address token,
        bytes32 ref
    ) external;
}

interface IOpenChainTokenMint {
    function mint(address to, uint256 amount) external;
}

contract OpenChainFaucet is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    address public immutable token;
    IOpenChainHub2 public immutable hub;

    uint256 public dripAmount;
    uint256 public cooldownSeconds;

    mapping(address => uint256) public lastDripAt;

    error CooldownActive(uint256 nextAllowedAt);

    constructor(
        address admin,
        address tokenAddress,
        address hubAddress,
        uint256 dripAmount_,
        uint256 cooldownSeconds_
    ) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);

        token = tokenAddress;
        hub = IOpenChainHub2(hubAddress);
        dripAmount = dripAmount_;
        cooldownSeconds = cooldownSeconds_;
    }

    function setParams(uint256 dripAmount_, uint256 cooldownSeconds_) external onlyRole(ADMIN_ROLE) {
        dripAmount = dripAmount_;
        cooldownSeconds = cooldownSeconds_;
    }

    function drip() external {
        uint256 last = lastDripAt[msg.sender];
        if (last != 0 && block.timestamp < last + cooldownSeconds) {
            revert CooldownActive(last + cooldownSeconds);
        }

        lastDripAt[msg.sender] = block.timestamp;
        IOpenChainTokenMint(token).mint(msg.sender, dripAmount);
        hub.log(msg.sender, msg.sender, msg.sender, IOpenChainHub2.ActionType.Faucet, dripAmount, token, bytes32(0));
    }
}
