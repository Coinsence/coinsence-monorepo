const ethers = require('ethers');

const ABI = require('./abis/CoinsenceKit.json');

const KitAddress = require('./addresses/CoinsenceKit.json');

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
  }

  static withRpcProvider(url, options = {}) {
    const provider = new ethers.providers.JsonRpcProvider(url);
    const signer = options.signer || provider.getSigner();
    return new CoinsenceKit(provider, signer, options);
  }

  async init() {
    return this.provider.getNetwork().then((network) => {
      this.address = this.address || KitAddress[network.chainId.toString()];

      this.contract = new ethers.Contract(
        this.address,
        this.abi,
        (this.signer || this.provider)
      );

      return this;
    });
  }

  newInstance(args, callOptions = {}) {
    let { name, descHash, root } = args;

    return this.contract.functions.newInstance(root, callOptions)
      .then(transaction => {
        return transaction.wait().then(result => {
          const txHash = result.transactionHash;
          const deployEvent = result.events.find(l => l.event === 'DeployInstance');
          //return apps proxy address
          const apps = result.events
            .filter(l => l.event === 'InstalledApp')
            .map(event => {
              return { id: event.args.appId, proxy: event.args.appProxy }
            })
          if (!deployEvent) { throw new Error('No DeployInstance event found') }

          return Promise.resolve({ txHash: txHash, daoAddress: deployEvent.args.dao, apps: apps});
        })
      });
  }

}

module.exports = CoinsenceKit;
