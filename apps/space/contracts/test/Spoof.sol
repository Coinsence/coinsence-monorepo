pragma solidity ^0.4.24;

import "@aragon/os/contracts/acl/ACL.sol";
import "@aragon/os/contracts/kernel/Kernel.sol";
import "@aragon/os/contracts/factory/DAOFactory.sol";

// You might think this file is a bit odd, but let me explain.
// We only use for now those imported contracts in our tests, which
// means Truffle will not compile them for us, because they are from
// an external dependency.


// solium-disable-next-line no-empty-blocks
contract Spoof {
  // ...
}