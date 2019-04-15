class Preflight {
  constructor(coinsence) {
    this.coinsence = coinsence;
  }

  check() {
    return this.coinsence.ipfs._ipfsAPI.id()
      .catch((error) => {
        throw new Error(`IPFS node not available; config: ${JSON.stringify(this.coinsence.ipfs.config)} - ${error.message}`);
      })
      .then(() => {
        let promises = Object.keys(this.coinsence.contracts).map((name) => {
          let contractWrapper = this.coinsence.contracts[name];
          return this.coinsencec.provider.getCode(contractWrapper.contract.address).then((code) => {
            // not sure if we always get the same return value if the code is not available
            // so checking if it is < 5 long
            if (code === '0x00' || code.length < 5) {
              throw new Error(`Contract for: ${name} not found at ${contractWrapper.contract.address} on network ${this.coinsence.provider.chainId}`);
            }
            return true;
          });
        });
        return Promise.all(promises);
      });
  }
}

module.exports = Preflight;
