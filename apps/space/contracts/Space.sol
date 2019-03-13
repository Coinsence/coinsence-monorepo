pragma solidity ^0.4.24;

import "@aragon/os/contracts/apps/AragonApp.sol";

///@title Space aragon app smart contract
///@author Coinsence blockchain team
contract Space is AragonApp {

    bytes32 public constant SPACE_MANAGER_ROLE = keccak256("SPACE_MANAGER_ROLE");

    ///@notice space name 
    string public name;

    ///@notice space owner
    address public owner;

    ///@notice space members
    address[] public members;

    ///@notice mapping to verifiy if address is a member in the space
    mapping(address => bool) public isMember;
 
    /**
     * @notice init space
     * @dev maybe using another function to set space parameters so we don't need to pass them later to the DAO
     * @param _name space name
     * @param _members space members (can be empty)
     */
    function initialize(string _name, address[] _members) public onlyInit {
        //check if all members addresses are valid
        require(verifyMembers(members), "invalid member address");

        //set space parameters
        name = _name;
        owner = msg.sender;
        members = _members;

        //mark all addresses as members
        for(uint i = 0; i < _members.length; i++) {
            isMember[_members[i]] = true;
        }

        //set space owner as member 
        members.push(msg.sender);
        isMember[msg.sender] = true;

        initialized();
    }

    /**
     * @notice verify members addresses
     * @dev maybe changing addresses verification in the front-end (less gas cost)
     * @param _members list of addresses
     * @return true if all addresses are valid, otherwise return false
     */
    function verifyMembers(address[] _members) internal pure returns(bool) {
        for(uint i = 0; i < _members.length; i++) {
            if(_members[i] == address(0)) {
                return false;
            }
        }
        return true;
    }

}
