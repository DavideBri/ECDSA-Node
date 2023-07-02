const secp = require('ethereum-cryptography/secp256k1');
const { toHex } = require('ethereum-cryptography/utils');
const { keccak256 } = require('ethereum-cryptography/keccak');

// we have to start by generating an private Key

const privateKey = secp.secp256k1.utils.randomPrivateKey();

console.log("private key: " + toHex(privateKey))
// from the private key we can generate a public key

const publicKey = secp.secp256k1.getPublicKey(privateKey);

console.log("public key: " + toHex(publicKey))

// now lets convert the public key in an ethereum address

const address = keccak256(publicKey.slice(1).slice(-20));

console.log("address: " + "0x"+toHex(address))
