pragma solidity ^0.4.24;

import "@aragon/os/contracts/apps/AragonApp.sol";


///@title Space aragon app smart contract
///@author Coinsence blockchain team
contract Space is AragonApp {

    event NewMember(address member);

    bytes32 public constant SPACE_MANAGER_ROLE = keccak256("SPACE_MANAGER_ROLE");

    ///@notice space description
    bytes32 public descHash;

    ///@notice space owner
    address public owner;

    ///@notice space members
    address[] public members;

    ///@notice mapping to verifiy if address is a member in the space
    mapping(address => bool) public isMember;

    /**
     * @notice init space
     * @dev maybe using another function to set space parameters so we don't need to pass them later to the DAO
     */
    function initialize(address _owner) public onlyInit {
        owner = _owner;

        //set space owner as member
        members.push(_owner);
        isMember[_owner] = true;

        initialized();
    }

    /**
     * @notice get space members count
     * @return members number
     */
    function getMembersCount() public view isInitialized returns (uint256) {
        return members.length;
    }

    /**
     * @notice add members to the space
     * @dev use this function to add members even if one member only (less functions)
     * @param _members list of members addresses
     */
    function addMembers(address[] _members) public isInitialized auth(SPACE_MANAGER_ROLE) {
        require(verifyMembers(_members), "invalid member address");

        for (uint i = 0; i < _members.length; i++) {
            //only add addresses that are not already members
            if (isMember[_members[i]] != true) {
                isMember[_members[i]] = true;
                members.push(_members[i]);

                emit NewMember(_members[i]);
            }
        }
    }

    /**
     * @notice leave space
     * @dev not the best way to do that...we may remove the members array completely
     */
    function leaveSpace() public isInitialized {
        require(isMember[msg.sender], "You are not a space member");

        //get address position in members array
        uint256 memberPosition = getMemberAddressPosition(msg.sender);
        //delete address
        delete members[memberPosition];
        //set as not member
        isMember[msg.sender] = false;
    }

    /**
     * @notice verify members addresses
     * @dev maybe changing addresses verification in the front-end (less gas cost)
     * @param _members list of addresses
     * @return true if all addresses are valid, otherwise return false
     */
    function verifyMembers(address[] _members) internal view returns(bool) {
        for (uint i = 0; i < _members.length; i++) {
            if ((_members[i] == address(0)) || (_members[i] == msg.sender)) {
                return false;
            }
        }
        return true;
    }

    /**
     * @notice set addresses as members
     * @param _members list of addresses
     */
    function setAsMembers(address[] _members) internal onlyInit {
        for (uint i = 0; i < _members.length; i++) {
            isMember[_members[i]] = true;
        }
    }

    /**
     * @notice Get member address position from members array
     * @param _address member address
     * @return position
     */
    function getMemberAddressPosition(address _address) internal view isInitialized returns (uint256) {
        require(isMember[_address], "member not found");

        for (uint256 i = 0; i < members.length; i++) {
            if (members[i] == _address) {
                return i;
            }
        }
    }
}
