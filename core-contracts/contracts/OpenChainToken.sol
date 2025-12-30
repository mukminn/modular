// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

interface IOpenChainHub {
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

contract OpenChainToken is ERC20, AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    IOpenChainHub public immutable hub;

    constructor(
        string memory name_,
        string memory symbol_,
        address admin,
        address hubAddress
    ) ERC20(name_, symbol_) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
        _grantRole(MINTER_ROLE, admin);

        hub = IOpenChainHub(hubAddress);
    }

    function mint(address to, uint256 amount) external onlyRole(ADMIN_ROLE) {
        _mint(to, amount);
        hub.log(to, msg.sender, to, IOpenChainHub.ActionType.Mint, amount, address(this), bytes32(0));
    }

    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
        hub.log(msg.sender, msg.sender, msg.sender, IOpenChainHub.ActionType.Burn, amount, address(this), bytes32(0));
    }

    function burnFrom(address from, uint256 amount) external {
        _spendAllowance(from, msg.sender, amount);
        _burn(from, amount);
        hub.log(from, msg.sender, from, IOpenChainHub.ActionType.Burn, amount, address(this), bytes32(0));
    }

    function transfer(address to, uint256 value) public override returns (bool) {
        bool ok = super.transfer(to, value);
        if (ok) {
            hub.log(msg.sender, msg.sender, to, IOpenChainHub.ActionType.Transfer, value, address(this), bytes32(0));
        }
        return ok;
    }

    function transferFrom(address from, address to, uint256 value) public override returns (bool) {
        bool ok = super.transferFrom(from, to, value);
        if (ok) {
            hub.log(from, msg.sender, to, IOpenChainHub.ActionType.Transfer, value, address(this), bytes32(0));
        }
        return ok;
    }

    function grantMinter(address account) external onlyRole(ADMIN_ROLE) {
        _grantRole(MINTER_ROLE, account);
    }
}
