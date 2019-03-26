pragma solidity ^0.4.24;

import "@aragon/os/contracts/apps/AragonApp.sol";
import "@aragon/os/contracts/lib/math/SafeMath.sol";

import "./StandardCoin.sol";

contract Coin is StandardCoin, AragonApp {
    
    using SafeMath for uint256;

    bytes32 public constant ISSUE_ROLE = keccak256("ISSUE_ROLE");
    bytes32 public constant MINT_ROLE = keccak256("MINT_ROLE");
    //bytes32 public constant TRANSFER_ROLE = keccak256("TRANSFER_ROLE");
    //bytes32 public constant ASSIGN_ROLE = keccak256("ASSIGN_ROLE");

    string private _name;
    string private _symbol;
    uint8 private _decimals;

    function initialize() public onlyInit {

        initialized();
    }

    function name() public view isInitialized returns(string) {
        return _name;
    }

    function symbol() public view isInitialized returns(string) {
        return _symbol;
    }

    function decimal() public view isInitialized returns(uint8) {
        return _decimals;
    }

    function issueToken(string memory name, string memory symbol, uint8 decimals) public isInitialized auth(ISSUE_ROLE) {
        _name = name;
        _symbol = symbol;
        _decimals = decimals;
    }

    function mintToken(uint256 amount) public isInitialized auth(MINT_ROLE) {
        require(amount > 0, "amount equal to zero");

        _mint(msg.sender, amount);
    }

}