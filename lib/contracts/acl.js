const Base = require('./base');
const EthersUtils = require('ethers').utils;

class Acl extends Base {

  hasPermission(fromAddress, contractAddress, roleID, params = null) {
    let roleHash = EthersUtils.keccak256(EthersUtils.toUtf8Bytes(roleID));
    return this.functions.hasPermission(fromAddress, contractAddress, roleHash, params);
  }
}

module.exports = Acl;
