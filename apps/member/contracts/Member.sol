pragma solidity ^0.4.24;

import "@aragon/os/contracts/apps/AragonApp.sol";


///@title Member aragon app smart contract
///@author Coinsence blockchain team
contract Member is AragonApp {

    ///@notice member structure
    struct Member {
        address account;
        bytes32 ipfsHash;
        bool exists;
    }

    ///@notice members ids
    mapping(address => uint32) public membersIds;
    ///@notice members list
    mapping(uint32 => Member) public members;
    ///@notice members counter
    uint32 public membersCount;

    event MemberProfileUpdated(uint32 id, bytes32 oldIpfsHash, bytes32 newIpfsHash);
    event MemberAccountUpdated(uint32 id, address oldAccount, address newAccount);
    event MemberAdded(uint32 id, address account);

    function initialize() public onlyInit {
        initialized();
    }

    function addMember(address account, bytes32 ipfsHash) public isInitialized {
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

    function updateMemberAccount(uint32 id, address oldAccount, address newAccount) public isInitialized {
        require(oldAccount == msg.sender, "you don't have permission");
        
        membersIds[oldAccount] = 0;
        membersIds[newAccount] = id;
        members[id].account = newAccount;
        
        emit MemberAccountUpdated(id, oldAccount, newAccount);
    }

    function updateMemberIpfsHash(uint32 id, bytes32 ipfsHash) public isInitialized {
        Member storage m = members[id];
                
        require(m.account == msg.sender, "you don't have permission");

        bytes32 oldIpfsHash = m.ipfsHash;
        m.ipfsHash = ipfsHash;

        emit MemberProfileUpdated(id, oldIpfsHash, m.ipfsHash);
    }

    function addressExists(address account) public view returns (bool) {
        return getMemberByAddress(account).exists;
    }

    function exists(uint32 id) public view returns (bool) {
        return members[id].exists;
    }

    function getContributorIdByAddress(address account) public view returns (uint32) {
        return membersIds[account];
    }

    function getContributorAddressById(uint32 id) public view returns (address) {
        return members[id].account;
    }

    function getMemberById(uint32 _id) public view returns (uint32 id, address account, bytes32 ipfsHash, bool exists ) {
        id = _id;
        Member storage c = members[_id];
        account = c.account;
        ipfsHash = c.ipfsHash;
        exists = c.exists;
    }

    function getMemberByAddress(address account) internal view returns (Member) {
        uint32 id = membersIds[account];
        return members[id];
    }

}