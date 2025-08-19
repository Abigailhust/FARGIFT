import React, { useState, useEffect } from 'react';

export function GiftList() {
  const [gifts, setGifts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState('0');

  // Mock contacts with avatars - in real app, this would come from user's address book
  const mockContacts = [
    { name: 'Alice', address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', avatar: '👩‍💼' },
    { name: 'Bob', address: '0x1234567890123456789012345678901234567890', avatar: '👨‍💻' },
    { name: 'Charlie', address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd', avatar: '👨‍🎨' },
    { name: 'Diana', address: '0x9876543210987654321098765432109876543210', avatar: '👩‍🎭' },
    { name: 'Eve', address: '0x1111111111111111111111111111111111111111', avatar: '👩‍🔬' },
    { name: 'Frank', address: '0x2222222222222222222222222222222222222222', avatar: '👨‍🏫' }
  ];

  // Mock gifts data with avatars
  const mockGifts = [
    {
      id: '1',
      sender: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      recipients: ['0x1234567890123456789012345678901234567890', '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd'],
      amount: '1000 ETH',
      limit: '1 ETH per account',
      title: 'Luv u ® !',
      desc: 'to Vitalik',
      status: 'active',
      createdAt: '2024-01-15 14:30',
      avatar: '👩‍💼'
    },
    {
      id: '2',
      sender: '0x1234567890123456789012345678901234567890',
      recipients: ['EVERYONE'],
      amount: '500 ETH',
      limit: '0.5 ETH per account',
      title: 'Happy New Year!',
      desc: 'Wishing everyone a wonderful year ahead',
      status: 'active',
      createdAt: '2024-01-14 09:15',
      avatar: '👨‍💻'
    },
    {
      id: '3',
      sender: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
      recipients: ['0x9876543210987654321098765432109876543210'],
      amount: '100 ETH',
      limit: '100 ETH per account',
      title: 'Birthday Gift',
      desc: 'Happy Birthday! Hope you have an amazing day',
      status: 'unwrapped',
      createdAt: '2024-01-13 16:45',
      avatar: '👨‍🎨'
    }
  ];

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

  const loadGifts = () => {
    // Simulate loading
    setTimeout(() => {
      setGifts(mockGifts);
      setIsLoading(false);
    }, 1000);
  };

  const formatAddress = (address) => {
    if (address === 'EVERYONE') return 'EVERYONE';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'active': { text: 'ACTIVE', class: 'status-active' },
      'unwrapped': { text: 'UNWRAPPED', class: 'status-unwrapped' },
      'taken_back': { text: 'TAKEN BACK', class: 'status-taken-back' },
      'expired': { text: 'EXPIRED', class: 'status-expired' }
    };

    const config = statusConfig[status] || { text: 'UNKNOWN', class: 'status-unknown' };

    return (
      <span className={`status-badge ${config.class}`}>
        {config.text}
      </span>
    );
  };

  const getUserAvatar = (address) => {
    const contact = mockContacts.find(c => c.address.toLowerCase() === address.toLowerCase());
    return contact ? contact.avatar : '👤';
  };

  const handleClaim = (giftId) => {
    console.log('Claiming gift:', giftId);
    alert('Claim functionality will be implemented with smart contract integration');
  };

  const handleExplore = (giftId) => {
    console.log('Exploring gift:', giftId);
    alert('Explore functionality will be implemented with smart contract integration');
  };

  if (isLoading) {
    return (
      <div className="gift-list">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading gifts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="gift-list">
      {isConnected && (
        <div className="balance-info">
          <div className="balance-amount">{balance} ETH</div>
          <div className="balance-label">Your Available Balance</div>
        </div>
      )}
      
      {gifts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎁</div>
          <p>No gifts found</p>
          <p>Create your first gift to get started!</p>
        </div>
      ) : (
        <div className="gifts-container">
          {gifts.map((gift, index) => (
            <div key={index} className={`gift-item ${gift.status}`}>
              <div className="gift-header">
                <div className="gift-sender">
                  <div className="user-avatar">{getUserAvatar(gift.sender)}</div>
                  <div className="sender-info">
                    <div className="sender-name">{formatAddress(gift.sender)}</div>
                    <div className="gift-time">{gift.createdAt}</div>
                  </div>
                </div>
                {getStatusBadge(gift.status)}
              </div>
              
              {gift.title && (
                <div className="gift-title">
                  <h3>{gift.title}</h3>
                </div>
              )}
              
              <div className="gift-details">
                <div className="gift-detail">
                  <div className="gift-detail-label">To:</div>
                  <div className="gift-detail-value recipient">
                    {gift.recipients.map(r => formatAddress(r)).join(', ')}
                  </div>
                </div>
                
                <div className="gift-detail">
                  <div className="gift-detail-label">Amount:</div>
                  <div className="gift-detail-value amount">{gift.amount}</div>
                </div>
                
                <div className="gift-detail">
                  <div className="gift-detail-label">Limit:</div>
                  <div className="gift-detail-value limit">{gift.limit}</div>
                </div>
                
                {gift.desc && (
                  <div className="gift-detail">
                    <div className="gift-detail-label">Message:</div>
                    <div className="gift-detail-value">{gift.desc}</div>
                  </div>
                )}
              </div>

              <div className="gift-actions">
                {gift.status === 'active' && (
                  <button 
                    onClick={() => handleClaim(gift.id)}
                    className="btn btn-primary"
                  >
                    $ CLAIM!
                  </button>
                )}
                
                <button 
                  onClick={() => handleExplore(gift.id)}
                  className="btn btn-secondary"
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