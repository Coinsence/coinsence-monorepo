const ipfsClient = require('ipfs-http-client');
const multihashes = require('multihashes');

class IPFS {

  constructor(config) {
    if (!config) {
      config = { host: 'localhost', port: '5001', protocol: 'http' };
    }
    this._ipfsAPI = ipfsClient(config);
    this._config = config;
  }

  catAndMerge(data, deserialize) {
    // if no hash details are found simply return the data; nothing to merge
    if (!data.hashSize || data.hashSize === 0) {
      return data;
    }
    // merge ipfsHash (encoded from hashDigest, hashSize, hashFunction)
    data.ipfsHash = multihashes.toB58String(this.encodeHash(data));

    return this.cat(data.ipfsHash)
      .then(deserialize)
      .then((attributes) => {
        return Object.assign({}, data, attributes);
      });
  }

  add(data) {
    return this._ipfsAPI
      .add(ipfsClient.Buffer.from(data))
      .then((res) => {
        return this.decodeHash(res[0].hash);
      });
  }

  cat(hashData) {
    let ipfsHash = hashData; // default - if it is a string
    if (hashData.hasOwnProperty('hashSize')) {
      ipfsHash = this.encodeHash(hashData);
    }
    return this._ipfsAPI.cat(ipfsHash);
  }

  decodeHash(ipfsHash) {
    let multihash = multihashes.decode(multihashes.fromB58String(ipfsHash));
    return {
      hashDigest: '0x' + multihashes.toHexString(multihash.digest),
      hashSize: multihash.length,
      hashFunction: multihash.code,
      ipfsHash: ipfsHash
    };
  }

  encodeHash(hashData) {
    let digest = ipfsClient.Buffer.from(hashData.hashDigest.slice(2), 'hex');
    return multihashes.encode(digest, hashData.hashFunction, hashData.hashSize);
  }

}

module.exports = IPFS;
