const ethers = require('ethers');

const ABI = require('./abis/CoinsenceKit.json');

const IPFS = require('./utils/ipfs');

class CoinsenceKit {

  constructor(provider, signer, options = {}) {
    let { address, abi, ipfsConfig } = options;

    this.provider = provider;
    this.signer = signer;
    this.options = options;
    this.address = address;
    this.abi = abi || ABI;
    this.ipfs = new IPFS(ipfsConfig);
    this.contract = new ethers.Contract(
      this.address,
      this.abi,
      (this.signer || this.provider)
    );
  }

  static withRpcProvider(url, options = {}) {
    const provider = new ethers.providers.JsonRpcProvider(url);
    const signer = options.signer || provider.getSigner();
    return new CoinsenceKit(provider, signer, options);
  }

  newInstance(args, options = {}) {
    let { name, descHash } = args;

    return this.contract.functions.newInstance(name, descHash, options)
      .then(transaction => {
        return transaction.wait().then(result => {
          const txHash = result.transactionHash;
          const deployEvent = result.events.find(l => l.event === 'DeployInstance');
          if (!deployEvent) { throw new Error('No DeployInstance event found') }

          return Promise.resolve({ txHash: txHash, daoAddress: deployEvent.args.dao });
        })
      });
  }

}

module.exports = CoinsenceKit;
