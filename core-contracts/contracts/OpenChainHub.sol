// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

contract OpenChainHub is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    enum ActionType {
        Mint,
        Burn,
        Transfer,
        Faucet
    }

    event Activity(
        address indexed user,
        address indexed actor,
        address indexed target,
        ActionType action,
        uint256 amount,
        address token,
        bytes32 ref
    );

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
    }

    function isAdmin(address account) external view returns (bool) {
        return hasRole(ADMIN_ROLE, account) || hasRole(DEFAULT_ADMIN_ROLE, account);
    }

    function log(
        address user,
        address actor,
        address target,
        ActionType action,
        uint256 amount,
        address token,
        bytes32 ref
    ) external {
        emit Activity(user, actor, target, action, amount, token, ref);
    }
}
