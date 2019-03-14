pragma solidity 0.4.24;

import "../../apm/APMNamehash.sol";


contract APMNamehashWrapper is APMNamehash {
    function getAPMNamehash(string name) external pure returns (bytes32) {
        return apmNamehash(name);
    }
}
