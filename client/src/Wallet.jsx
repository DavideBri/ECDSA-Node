import React, { useState } from "react";
import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import {keccak256} from "ethereum-cryptography/keccak";
import {toHex} from "ethereum-cryptography/utils";




function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey}) {
  const ethereum = window.ethereum;
  const [connected, setConnected] = useState(false);

  async function onClick() {
    ethereum
      .request({ method: 'eth_requestAccounts' })
      .then(handleAccountsChanged)
      .catch((error) => {
        if (error.code === 4001) {
          // EIP-1193 userRejectedRequest error
          console.log('Please connect to MetaMask.');
        } else {
          console.error(error);
        }
      });
    
};
  
  async function handleAccountsChanged(accounts) {
    setConnected(true);
    console.log(`Connected to ${accounts[0]}`);
    const address = accounts[0].slice(2);
    setAddress(address);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  
  async function onChange(evt) {
    const privateKey = evt.target.value;
    
    setPrivateKey(privateKey);
    // get the public key of the private key
    const pubKey = secp.secp256k1.getPublicKey(privateKey);
    // lets translate that to an ethereum address
    const address =  toHex(keccak256(pubKey.slice(1).slice(-20)));
    setAddress(address);
    console.log("pvtKey:" + privateKey + "\n"+ "pubKey:"  + toHex(pubKey) + "\n" + "addr:" +  "0x"+ address + "\n")
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>
      <div>
      {connected ? (
        <p>Connected to MetaMask</p>
      ) : (
        <input type="submit" className="button" value="Sign In via Metamask" onClick={onClick}/>
      )}
    </div>
      
    <div>
      {address ? `Your address is 0x${address.slice(0,3)}...${address.slice(-3)}` : ""}
    </div>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
