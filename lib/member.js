const ethers = require('ethers');

const ABI = require('./abis/Member.json');

const KitAddress = require('./addresses/CoinsenceKit.json');

const IPFS = require('./utils/ipfs');

class Member {

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
        return new Member(provider, signer, options);
    }

    async init() {
        return this.provider.getNetwork().then((network) => {
            this.address = this.address;
        
            this.contract = new ethers.Contract(
                this.address,
                this.abi,
                (this.signer || this.provider)
            );
        
            return this;
        });
    }

}

module.exports = Member;
