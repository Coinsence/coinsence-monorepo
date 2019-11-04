pragma solidity ^0.4.24;

import "@aragon/os/contracts/apps/AragonApp.sol";
import "@aragon/os/contracts/lib/math/SafeMath.sol";

import "./StandardCoin.sol";


///@title Coin aragon app smart contract
///@author Coinsence blockchain team
contract Coin is StandardCoin, AragonApp {
    
    using SafeMath for uint256;

    bytes32 public constant ISSUE_ROLE = keccak256("ISSUE_ROLE");
    bytes32 public constant MINT_ROLE = keccak256("MINT_ROLE");
    //bytes32 public constant TRANSFER_ROLE = keccak256("TRANSFER_ROLE");
    //bytes32 public constant ASSIGN_ROLE = keccak256("ASSIGN_ROLE");

    ///@notice coin name
    string private _name;
    ///@notice coin symbol
    string private _symbol;
    ///@notice coin decimals
    uint8 private _decimals;

    /**
     * @notice init coin
     */
    function initialize(string memory name, string memory symbol, uint8 decimals) public onlyInit {
        _name = name;
        _symbol = symbol;
        _decimals = decimals;

        initialized();
    }

    /**
     * @notice get coin name
     * @return coin name
     */
    function name() public view isInitialized returns(string) {
        return _name;
    }

    /**
     * @notice get coin symbol
     * @return coin symbol
     */
    function symbol() public view isInitialized returns(string) {
        return _symbol;
    }

    /**
     * @notice get coin decimal
     * @return coin decimal
     */
    function decimals() public view isInitialized returns(uint8) {
        return _decimals;
    }

    /**
     * @notice mint coin
     * @param amount amount of coins to mint
     */
    function mintCoin(address recipient, uint256 amount) public isInitialized auth(MINT_ROLE) {
        require(recipient != address(0), "invalid recipient address");
        require(amount > 0, "amount equal to zero");

        _mint(recipient, amount);
    }

}