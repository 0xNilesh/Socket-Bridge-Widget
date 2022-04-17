import { useState } from "react";
import { ethers } from "ethers";
import BridgeWidget from "./widgets/BridgeWidget";

const App = () => {
  const [address, setAddress] = useState('');
  const [provider, setProvider] = useState('');

  const connectWallet = async () => {
    // A Web3Provider wraps a standard Web3 provider, which is
    // what MetaMask injects as window.ethereum into each page
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);

    // MetaMask requires requesting permission to connect users accounts
    const response = await provider.send("eth_requestAccounts", []);
    setAddress(response[0]);
  }

  return (
    <>
      <button onClick={() => connectWallet()}>{address ? address : 'Connect Wallet'}</button>
      <div style={{margin:'50px'}}>
        <BridgeWidget address={address} provider={provider} />
      </div>
    </>
  )
}

export default App;