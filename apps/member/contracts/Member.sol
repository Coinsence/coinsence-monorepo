pragma solidity ^0.4.24;

import "@aragon/os/contracts/apps/AragonApp.sol";


///@title Member aragon app smart contract
///@author Coinsence blockchain team
contract Member is AragonApp {

    struct Member {
        address account;
        bytes32 ipfsHash;
        bool exists;
    }

    mapping(address => uint32) public membersIds;
    mapping(uint32 => Member) public members;
    uint32 public membersCount;

    /**
     * events
     */
    event MemberProfileUpdated(uint32 id, bytes32 oldIpfsHash, bytes32 newIpfsHash);
    event MemberAccountUpdated(uint32 id, address oldAccount, address newAccount);
    event MemberAdded(uint32 id, address account);

    /**
     * @notice init member app
     */
    function initialize() public onlyInit {
        initialized();
    }

    /**
     * @notice add new member
     */
    function addMember(address account, bytes32 ipfsHash) public isInitialized {
        require(account != address(0), "invalid address");
        require(!addressExists(account));
        uint32 _id = membersCount + 1;
        Member storage m = members[_id];
        m.account = account;
        m.ipfsHash = ipfsHash;
        m.exists = true;
        membersIds[account] = _id;

        membersCount += 1;
        emit MemberAdded(_id, account);
    }

    /**
     * @notice update member account information
     */
    function updateMemberAccount(uint32 id, address oldAccount, address newAccount) public isInitialized {
        require(oldAccount == msg.sender, "you don't have permission");
        
        membersIds[oldAccount] = 0;
        membersIds[newAccount] = id;
        members[id].account = newAccount;
        
        emit MemberAccountUpdated(id, oldAccount, newAccount);
    }

    /**
     * @notice update member IPFS information
     */
    function updateMemberIpfsHash(uint32 id, bytes32 ipfsHash) public isInitialized {
        Member storage m = members[id];
                
        require(m.account == msg.sender, "you don't have permission");

        bytes32 oldIpfsHash = m.ipfsHash;
        m.ipfsHash = ipfsHash;

        emit MemberProfileUpdated(id, oldIpfsHash, m.ipfsHash);
    }
    
    /**
     * @notice check if member address exist
     */
    function addressExists(address account) public view returns (bool) {
        return getMemberByAddress(account).exists;
    }

    /**
     * @notice check if address exist
     */
    function exists(uint32 id) public view returns (bool) {
        return members[id].exists;
    }

    /**
     * @notice get member id by address
     */
    function getMemberIdByAddress(address account) public view returns (uint32) {
        return membersIds[account];
    }

    /**
     * @notice get member address by id
     */
    function getMemberAddressById(uint32 id) public view returns (address) {
        return members[id].account;
    }

    /**
     * @notice get member by id
     */
    function getMemberById(uint32 _id) public view returns (uint32 id, address account, bytes32 ipfsHash, bool exists ) {
        id = _id;
        Member storage c = members[_id];
        account = c.account;
        ipfsHash = c.ipfsHash;
        exists = c.exists;
    }

    /**
     * @notice get member by address
     */
    function getMemberByAddress(address account) internal view returns (Member) {
        uint32 id = membersIds[account];
        return members[id];
    }

}