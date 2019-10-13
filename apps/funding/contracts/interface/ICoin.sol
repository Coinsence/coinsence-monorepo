pragma solidity ^0.4.24;

/**
 * @title Coin interface
 */
interface ICoin {
    function mintCoin(address recipient, uint256 amount) external returns (bool);
}