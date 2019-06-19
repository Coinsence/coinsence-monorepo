const rlp = require('rlp');
const keccak = require('keccak');

module.exports = function calculateAddress(sender, nonce) {
    //var nonce = 0x3D; //The nonce must be a hex literal!
    //var sender = '0x4d99d767477fbb2b47efeb17e2a78970ad22ccc1'; //Requires a hex string as input!

    let input_arr = [ sender, nonce ];
    let rlp_encoded = rlp.encode(input_arr);

    let contract_address_long = keccak('keccak256').update(rlp_encoded).digest('hex');

    let contract_address = '0x' + contract_address_long.substring(24); //Trim the first 24 characters.
    return contract_address;
}
