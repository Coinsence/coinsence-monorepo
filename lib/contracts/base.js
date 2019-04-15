class Base {
  constructor(contract) {
    this.contract = contract;
  }

  get functions() {
    return this.contract.functions;
  }

  get ipfs() {
    if (!this._ipfsAPI) { throw new Error('IPFS API not configured; please set an ipfs instance'); }
    return this._ipfsAPI;
  }

  set ipfs(ipfsAPI) {
    this._ipfsAPI = ipfsAPI;
  }

  on(type, callback) {
    return this.contract.on(type, callback);
  }
}
module.exports = Base;
