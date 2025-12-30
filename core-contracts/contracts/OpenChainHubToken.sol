// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

contract OpenChainHubToken is ERC20, AccessControl {
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

    uint256 public dripAmount;
    uint256 public cooldownSeconds;

    mapping(address => uint256) public lastDripAt;

    error CooldownActive(uint256 nextAllowedAt);

    constructor(
        string memory name_,
        string memory symbol_,
        address admin,
        uint256 dripAmount_,
        uint256 cooldownSeconds_
    ) ERC20(name_, symbol_) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);

        dripAmount = dripAmount_;
        cooldownSeconds = cooldownSeconds_;
    }

    function isAdmin(address account) external view returns (bool) {
        return hasRole(ADMIN_ROLE, account) || hasRole(DEFAULT_ADMIN_ROLE, account);
    }

    function setFaucetParams(uint256 dripAmount_, uint256 cooldownSeconds_) external onlyRole(ADMIN_ROLE) {
        dripAmount = dripAmount_;
        cooldownSeconds = cooldownSeconds_;
    }

    function mint(address to, uint256 amount) external onlyRole(ADMIN_ROLE) {
        _mint(to, amount);
        emit Activity(to, msg.sender, to, ActionType.Mint, amount, address(this), bytes32(0));
    }

    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
        emit Activity(msg.sender, msg.sender, msg.sender, ActionType.Burn, amount, address(this), bytes32(0));
    }

    function burnFrom(address from, uint256 amount) external {
        _spendAllowance(from, msg.sender, amount);
        _burn(from, amount);
        emit Activity(from, msg.sender, from, ActionType.Burn, amount, address(this), bytes32(0));
    }

    function drip() external {
        uint256 last = lastDripAt[msg.sender];
        if (last != 0 && block.timestamp < last + cooldownSeconds) {
            revert CooldownActive(last + cooldownSeconds);
        }

        lastDripAt[msg.sender] = block.timestamp;
        _mint(msg.sender, dripAmount);
        emit Activity(msg.sender, msg.sender, msg.sender, ActionType.Faucet, dripAmount, address(this), bytes32(0));
    }

    function transfer(address to, uint256 value) public override returns (bool) {
        bool ok = super.transfer(to, value);
        if (ok) {
            emit Activity(msg.sender, msg.sender, to, ActionType.Transfer, value, address(this), bytes32(0));
        }
        return ok;
    }

    function transferFrom(address from, address to, uint256 value) public override returns (bool) {
        bool ok = super.transferFrom(from, to, value);
        if (ok) {
            emit Activity(from, msg.sender, to, ActionType.Transfer, value, address(this), bytes32(0));
        }
        return ok;
    }
}
