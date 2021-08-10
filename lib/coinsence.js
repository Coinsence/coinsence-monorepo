const ethers = require('ethers');

const Preflight = require('./utils/preflight');

const ABIS = {
  Coin: require('./abis/Coin.json'),
  Space: require('./abis/Space.json'),
  Member: require('./abis/Member.json'),
  Kernel: require('./abis/Kernel.json'),
  Acl: require('./abis/ACL.json')
};
const APP_CONTRACTS = [
  'Coin',
  'Space',
  'Member',
  'Acl'
];
const DaoAddresses = require('./addresses/dao.json');

const Contracts = require('./contracts');
const IPFS = require('./utils/ipfs')

// Helpers
function capitalize(word) {
  let [first, ...rest] = word;
  return `${first.toUpperCase()}${rest.join('')}`;
}

class Coinsence {

  constructor(provider, signer, options = {}) {
    let { addresses, abis, ipfsConfig } = options;

    this.provider = provider;
    this.signer = signer;
    this.options = options;
    this.addresses = addresses || {};
    this.abis = abis || ABIS;
    this.ipfs = new IPFS(ipfsConfig);
    this.contracts = {};
  }

  
  static withRpcProvider(url, options = {}) {
    const provider = new ethers.providers.JsonRpcProvider(url);
    const signer = options.signer || (provider.getSigner()).getAddress();
    return new Coinsence(provider, signer, options);
  }

  forDAO(kernelAddress) {
    this.addresses['Kernel'] = kernelAddress;
    return this;
  }

  init(names) {
    let contractsToLoad = names || APP_CONTRACTS;
    return this.provider.getNetwork().then(network => {
      this.addresses['Kernel'] = this.addresses['Kernel'] || DaoAddresses[network.chainId.toString()];
      let addressPromises = contractsToLoad.map((contractName) => {
        return this.Kernel.getApp(contractName).then((address) => {
          this.addresses[contractName] = address;
        }).catch((error) => {
          console.log(error);
          throw new Error(`Failed to get address for ${contractName} from DAO at ${this.Kernel.contract.address}
            - ${error.message}`
          );
        });
      });
      return Promise.all(addressPromises).then(() => { return this });
    }).catch((error) => {
      console.log(error);
    });
  }

  get Kernel() {
    let k = this.contractFor('Kernel');
    // in case we want to use a special apm (e.g. development vs. production)
    if (this.options.apm) {
      k.apm = this.options.apm;
    }
    return k;
  }

  get Coin() {
    return this.contractFor('Coin');
  }

  get Space() {
    return this.contractFor('Space');
  }

  get Member() {
    return this.contractFor('Member');
  }

  get Acl() {
    return this.contractFor('Acl');
  }

  // Should be private
  contractFor(name) {
    if (this.contracts[name]) {
      return this.contracts[name];
    }

    const contractName = capitalize(name);
    const address = this.addresses[contractName];
    const abi = this.abis[contractName];
    if (!address || !abi) {
      throw new Error(`Address or ABI not found for ${contractName}`);
    }

    let signerOrProvider = this.signer || this.provider;
    let contract = new ethers.Contract(address, abi, signerOrProvider);
    this.contracts[name] = new Contracts[contractName](contract);
    this.contracts[name].ipfs = this.ipfs;

    return this.contracts[name];
  }

  preflightChecks() {
    return new Preflight(this).check();
  }
}

module.exports = Coinsence;
