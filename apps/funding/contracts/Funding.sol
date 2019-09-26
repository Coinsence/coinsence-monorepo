pragma solidity ^0.4.24;

import "@aragon/os/contracts/apps/AragonApp.sol";


contract Funding is AragonApp {

    function initialize() public onlyInit {
        initialized();
    }
}
