/*module.exports = function calculateAddress(sender, nonce) {
}*/

const rlp = require('rlp');
const keccak = require('keccak');

var nonce = 0x3F; //The nonce must be a hex literal!
var sender = '0x4d99d767477fbb2b47efeb17e2a78970ad22ccc1'; //Requires a hex string as input!

var input_arr = [ sender, nonce ];
var rlp_encoded = rlp.encode(input_arr);

var contract_address_long = keccak('keccak256').update(rlp_encoded).digest('hex');

var contract_address = contract_address_long.substring(24); //Trim the first 24 characters.
console.log("contract_address: " + contract_address);
