import React, { useState, useEffect } from 'react';

export function GiftList() {
  const [gifts, setGifts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [balance, setBalance] = useState('0');
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState('');

  useEffect(() => {
    checkConnection();
    loadGifts();
    
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

  const loadGifts = async () => {
    try {
      // Mock data with the specific content you requested
      const mockGifts = [
        {
          id: '0x1234...',
          sender: '0x2333.33330',
          recipients: ['EVERYONE'],
          amount: '1000 ETH',
          limit: '1 ETH per account',
          status: 'active',
          createdAt: '2024-01-15',
          title: 'Luv u ® ! to Vitalik',
          desc: 'Special gift for everyone'
        },
        {
          id: '0x5678...',
          sender: '0xabcd...',
          recipients: ['0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6'],
          amount: '0.5 ETH',
          limit: '0.5 ETH per account',
          status: 'active',
          createdAt: '2024-01-14',
          title: 'Birthday Gift',
          desc: 'Happy Birthday!'
        },
        {
          id: '0x9abc...',
          sender: '0xefgh...',
          recipients: ['0x1234567890123456789012345678901234567890'],
          amount: '0.1 ETH',
          limit: '0.1 ETH per account',
          status: 'unwrapped',
          createdAt: '2024-01-13',
          title: 'Welcome Gift',
          desc: 'Welcome to the community!'
        }
      ];
      
      setGifts(mockGifts);
    } catch (error) {
      console.error('Failed to load gift list:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'active': { text: 'ACTIVE', class: 'status-active' },
      'unwrapped': { text: 'UNWRAPPED', class: 'status-unwrapped' },
      'taken_back': { text: 'TAKEN BACK', class: 'status-taken-back' },
      'expired': { text: 'EXPIRED', class: 'status-expired' }
    };
    
    const statusInfo = statusMap[status] || { text: status, class: 'status-unknown' };
    
    return <span className={`status-badge ${statusInfo.class}`}>{statusInfo.text}</span>;
  };

  const formatAddress = (address) => {
    if (!address) return 'N/A';
    if (address === 'EVERYONE') return 'EVERYONE';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleClaim = async (giftId) => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      // TODO: Call smart contract to claim gift
      console.log('Claiming gift:', giftId);
      alert('Gift claimed successfully!');
    } catch (error) {
      console.error('Failed to claim gift:', error);
      alert('Failed to claim gift: ' + error.message);
    }
  };

  const handleExplore = (giftId) => {
    // Open in block explorer
    const explorerUrl = `https://sepolia.arbiscan.io/tx/${giftId}`;
    window.open(explorerUrl, '_blank');
  };

  if (isLoading) {
    return (
      <div className="gift-list">
        <h2>📋 Gift List</h2>
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="gift-list">
      <h2>📋 Gift List</h2>
      
      {isConnected && (
        <div className="balance-info">
          <p>💰 Your Balance: <strong>{balance} ETH</strong></p>
        </div>
      )}
      
      {gifts.length === 0 ? (
        <div className="empty-state">
          <p>No gifts found</p>
          <p>Create your first gift!</p>
        </div>
      ) : (
        <div className="gifts-container">
          {gifts.map((gift, index) => (
            <div key={index} className={`gift-item ${gift.status}`}>
              <div className="gift-header">
                <span className="gift-id">{gift.id}</span>
                {getStatusBadge(gift.status)}
              </div>
              
              {gift.title && (
                <div className="gift-title">
                  <h3>{gift.title}</h3>
                </div>
              )}
              
              <div className="gift-details">
                <div className="detail-row">
                  <span className="label">From:</span>
                  <span className="value address">{formatAddress(gift.sender)}</span>
                </div>
                
                <div className="detail-row">
                  <span className="label">To:</span>
                  <span className="value recipient">
                    {gift.recipients.map(r => formatAddress(r)).join(', ')}
                  </span>
                </div>
                
                <div className="detail-row">
                  <span className="label">Amount:</span>
                  <span className="value amount">{gift.amount}</span>
                </div>
                
                <div className="detail-row">
                  <span className="label">Limit:</span>
                  <span className="value limit">{gift.limit}</span>
                </div>
                
                {gift.desc && (
                  <div className="detail-row">
                    <span className="label">Message:</span>
                    <span className="value">{gift.desc}</span>
                  </div>
                )}
                
                <div className="detail-row">
                  <span className="label">Created:</span>
                  <span className="value">{gift.createdAt}</span>
                </div>
              </div>

              <div className="gift-actions">
                {gift.status === 'active' && (
                  <button 
                    onClick={() => handleClaim(gift.id)}
                    className="claim-btn"
                  >
                    $ CLAIM!
                  </button>
                )}
                
                <button 
                  onClick={() => handleExplore(gift.id)}
                  className="explore-btn"
                >
                  explore
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 