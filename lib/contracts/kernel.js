const namehash = require('ethers').utils.namehash;
const Base = require('./base');

const KERNEL_APP_ADDR_NAMESPACE = '0xd6f028ca0e8edb4a8c9757ca4fdccab25fa1e0317da1188108f7d2dee14902fb';

class Kernel extends Base {
  constructor(contract) {
    super(contract);
    this.apm = 'aragonpm.eth'; // can be overwritten if needed
  }

  getApp(appName) {
    if (appName === 'Acl') {
      return this.functions.acl();
    }
    return this.functions.getApp(KERNEL_APP_ADDR_NAMESPACE, this.appNamehash(appName));
  }

  appNamehash(appName) {
    return namehash(`kredits-${appName.toLowerCase()}.${this.apm}`);
  }
}

module.exports = Kernel;
