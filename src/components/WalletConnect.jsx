import React from 'react';
import { useWeb3 } from '../contexts/Web3Context';

const WalletConnect = () => {
  const { 
    account, 
    isConnected, 
    loading, 
    connectWallet, 
    disconnectWallet 
  } = useWeb3();

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (loading) {
    return (
      <div className="wallet-connect">
        <button className="connect-button" disabled>
          Connecting...
        </button>
      </div>
    );
  }

  if (isConnected && account) {
    return (
      <div className="wallet-connect">
        <div className="wallet-info">
          <span className="wallet-address">{formatAddress(account)}</span>
          <button className="disconnect-button" onClick={disconnectWallet}>
            Disconnect
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="wallet-connect">
      <button className="connect-button" onClick={connectWallet}>
        Connect Petra Wallet
      </button>
    </div>
  );
};

export default WalletConnect;
