import React, { useState, useEffect } from 'react';

export function GiftCreator() {
  const [recipients, setRecipients] = useState(['']);
  const [ethAmount, setEthAmount] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState('0');
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [transactionHash, setTransactionHash] = useState('');
  const [transactionStatus, setTransactionStatus] = useState('');

  // Mock contacts - in real app, this would come from user's address book
  const mockContacts = [
    { name: 'Alice', address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6' },
    { name: 'Bob', address: '0x1234567890123456789012345678901234567890' },
    { name: 'Charlie', address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd' },
    { name: 'Diana', address: '0x9876543210987654321098765432109876543210' }
  ];

  useEffect(() => {
    checkConnection();
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

  const addRecipient = () => {
    setRecipients([...recipients, '']);
  };

  const removeRecipient = (index) => {
    if (recipients.length > 1) {
      const newRecipients = recipients.filter((_, i) => i !== index);
      setRecipients(newRecipients);
    }
  };

  const updateRecipient = (index, value) => {
    const newRecipients = [...recipients];
    newRecipients[index] = value;
    setRecipients(newRecipients);
  };

  const selectContact = (index, contact) => {
    const newRecipients = [...recipients];
    newRecipients[index] = contact.address;
    setRecipients(newRecipients);
  };

  const validateForm = () => {
    if (!isPublic && recipients.every(r => !r.trim())) {
      alert('Please enter at least one recipient address or select public gift');
      return false;
    }

    if (!ethAmount || parseFloat(ethAmount) <= 0) {
      alert('Please enter a valid ETH amount');
      return false;
    }

    if (parseFloat(ethAmount) > parseFloat(balance)) {
      alert('Insufficient balance. You have ' + balance + ' ETH');
      return false;
    }

    return true;
  };

  // Transaction handler function - to be implemented by another team
  const sendTransactionHandler = async (transactionData) => {
    try {
      setTransactionStatus('pending');
      
      // This function will be implemented by another team
      // They should return a transaction hash
      const hash = await window.sendGiftTransaction(transactionData);
      
      setTransactionHash(hash);
      setTransactionStatus('success');
      
      console.log('Transaction sent successfully:', hash);
      return hash;
    } catch (error) {
      console.error('Transaction failed:', error);
      setTransactionStatus('failed');
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setTransactionStatus('pending');
    setTransactionHash('');
    
    try {
      // Prepare transaction data
      const transactionData = {
        recipients: isPublic ? [] : recipients.filter(r => r.trim()),
        isPublic,
        ethAmount: parseFloat(ethAmount),
        title: title.trim() || undefined,
        description: desc.trim() || undefined,
        sender: address,
        timestamp: Date.now()
      };

      // Call the transaction handler
      const hash = await sendTransactionHandler(transactionData);
      
      // Reset form after successful transaction
      setRecipients(['']);
      setEthAmount('');
      setTitle('');
      setDesc('');
      
      // Refresh balance
      await fetchBalance(address);
      
      alert(`Gift creation transaction sent! Hash: ${hash}`);
      
    } catch (error) {
      console.error('Failed to create gift:', error);
      if (error.code === 4001) {
        alert('Transaction was rejected by user');
      } else {
        alert('Failed to create gift: ' + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const viewTransaction = () => {
    if (transactionHash) {
      // Open in block explorer
      const explorerUrl = `https://sepolia.arbiscan.io/tx/${transactionHash}`;
      window.open(explorerUrl, '_blank');
    }
  };

  if (!isConnected) {
    return (
      <div className="gift-creator">
        <h2>🎁 Create New Gift</h2>
        <div className="not-connected">
          <p>Please connect your wallet to create gifts</p>
        </div>
      </div>
    );
  }

  return (
    <div className="gift-creator">
      <h2>🎁 Create New Gift</h2>
      
      <div className="balance-info">
        <p>💰 Your Balance: <strong>{balance} ETH</strong></p>
      </div>
      
      <form onSubmit={handleSubmit} className="gift-form">
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
            Public gift (anyone can unwrap)
          </label>
        </div>

        {!isPublic && (
          <div className="form-group">
            <label>Recipients:</label>
            {recipients.map((recipient, index) => (
              <div key={index} className="recipient-input">
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => updateRecipient(index, e.target.value)}
                  placeholder="0x..."
                  disabled={isLoading}
                />
                <select 
                  onChange={(e) => selectContact(index, mockContacts.find(c => c.address === e.target.value))}
                  disabled={isLoading}
                >
                  <option value="">Select Contact</option>
                  {mockContacts.map((contact, contactIndex) => (
                    <option key={contactIndex} value={contact.address}>
                      {contact.name} ({contact.address.slice(0, 6)}...{contact.address.slice(-4)})
                    </option>
                  ))}
                </select>
                {recipients.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => removeRecipient(index)}
                    className="remove-btn"
                    disabled={isLoading}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button 
              type="button" 
              onClick={addRecipient}
              className="add-btn"
              disabled={isLoading}
            >
              + Add Recipient
            </button>
          </div>
        )}

        <div className="form-group">
          <label>Gift Title (Optional):</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Happy Birthday!"
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label>Message (Optional):</label>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Write a personal message..."
            rows="3"
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label>ETH Amount:</label>
          <input
            type="number"
            value={ethAmount}
            onChange={(e) => setEthAmount(e.target.value)}
            placeholder="0.01"
            step="0.001"
            min="0.001"
            max={balance}
            disabled={isLoading}
          />
          <small className="balance-hint">
            Available: {balance} ETH
          </small>
        </div>

        <button 
          type="submit" 
          className="submit-btn"
          disabled={isLoading || parseFloat(ethAmount) > parseFloat(balance)}
        >
          {isLoading ? 'Creating...' : 'Create Gift'}
        </button>
      </form>

      {/* Transaction Status Display */}
      {transactionStatus && (
        <div className="transaction-status">
          <h3>Transaction Status</h3>
          <div className={`status-indicator ${transactionStatus}`}>
            {transactionStatus === 'pending' && '⏳ Processing...'}
            {transactionStatus === 'success' && '✅ Success!'}
            {transactionStatus === 'failed' && '❌ Failed'}
          </div>
          
          {transactionHash && (
            <div className="transaction-hash">
              <p>Transaction Hash: <code>{transactionHash}</code></p>
              <button
                type="button"
                className="view-tx-btn"
                onClick={viewTransaction}
              >
                View Transaction
              </button>
            </div>
          )}
        </div>
      )}

      {/* Transaction Example Section */}
      <div className="transaction-example">
        <h3>Send Transaction Example</h3>
        <div className="example-container">
          <button
            type="button"
            className="example-btn"
            onClick={() => {
              const exampleData = {
                recipients: ['0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6'],
                isPublic: false,
                ethAmount: 0.01,
                title: 'Example Gift',
                description: 'This is an example transaction',
                sender: address,
                timestamp: Date.now()
              };
              sendTransactionHandler(exampleData);
            }}
            disabled={!isConnected}
          >
            Send Example Transaction
          </button>
          
          {transactionHash && (
            <button
              type="button"
              className="view-tx-btn"
              onClick={viewTransaction}
            >
              View Transaction
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 