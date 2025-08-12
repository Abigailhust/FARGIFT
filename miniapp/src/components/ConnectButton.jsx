import React, { useState, useEffect } from 'react';

export function ConnectButton() {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState('');

  useEffect(() => {
    checkConnection();
    
    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const checkConnection = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setIsConnected(true);
          setAddress(accounts[0]);
        }
      } catch (error) {
        console.error('Failed to check connection:', error);
      }
    }
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      setIsConnected(false);
      setAddress('');
    } else {
      setIsConnected(true);
      setAddress(accounts[0]);
    }
  };

  const handleChainChanged = () => {
    window.location.reload();
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask!');
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      
      if (accounts.length > 0) {
        setIsConnected(true);
        setAddress(accounts[0]);
      }
    } catch (error) {
      console.error('Failed to connect:', error);
      alert('Failed to connect wallet: ' + error.message);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAddress('');
  };

  if (isConnected) {
    return (
      <div className="connect-button">
        <div className="connection-info">
          <span className="address">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        </div>
        
        <div className="connection-actions">
          <button onClick={disconnectWallet} className="disconnect-btn">
            Disconnect
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="connect-button">
      <button onClick={connectWallet} className="connect-btn">
        Connect Wallet
      </button>
    </div>
  );
} 