import React, { useState, useEffect } from 'react';

export function ConnectButton() {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState('0');
  const [isLoading, setIsLoading] = useState(false);

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
          await fetchBalance(accounts[0]);
        }
      } catch (error) {
        console.error('Failed to check connection:', error);
      }
    }
  };

  const fetchBalance = async (accountAddress) => {
    try {
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [accountAddress, 'latest']
      });
      
      // Convert from wei to ETH
      const balanceInEth = (parseInt(balance, 16) / Math.pow(10, 18)).toFixed(4);
      setBalance(balanceInEth);
    } catch (error) {
      console.error('Failed to fetch balance:', error);
      setBalance('0');
    }
  };

  const handleAccountsChanged = async (accounts) => {
    if (accounts.length === 0) {
      setIsConnected(false);
      setAddress('');
      setBalance('0');
    } else {
      setIsConnected(true);
      setAddress(accounts[0]);
      await fetchBalance(accounts[0]);
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

    setIsLoading(true);
    
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      
      if (accounts.length > 0) {
        setIsConnected(true);
        setAddress(accounts[0]);
        await fetchBalance(accounts[0]);
      }
    } catch (error) {
      console.error('Failed to connect:', error);
      alert('Failed to connect wallet: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAddress('');
    setBalance('0');
  };

  if (isConnected) {
    return (
      <div className="connect-button">
        <div className="connection-info">
          <span className="address">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
          <span className="balance">
            💰 {balance} ETH
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
      <button 
        onClick={connectWallet} 
        className="connect-btn"
        disabled={isLoading}
      >
        {isLoading ? 'Connecting...' : 'Connect Wallet'}
      </button>
    </div>
  );
} 