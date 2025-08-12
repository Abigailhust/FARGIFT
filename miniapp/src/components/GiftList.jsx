import React, { useState, useEffect } from 'react'

export function GiftList() {
  const [gifts, setGifts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // TODO: Load gifts from smart contract
    loadGifts()
  }, [])

  const loadGifts = async () => {
    try {
      // Mock data, should be fetched from contract
      const mockGifts = [
        {
          id: '0x1234...',
          sender: '0xabcd...',
          recipient: '0x5678...',
          amount: '0.1 ETH',
          status: 'active',
          createdAt: '2024-01-15'
        },
        {
          id: '0x5678...',
          sender: '0xefgh...',
          recipient: 'Public',
          amount: '0.05 ETH',
          status: 'active',
          createdAt: '2024-01-14'
        }
      ]
      
      setGifts(mockGifts)
    } catch (error) {
      console.error('Failed to load gift list:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      'active': { text: 'Active', class: 'status-active' },
      'unwrapped': { text: 'Unwrapped', class: 'status-unwrapped' },
      'taken_back': { text: 'Taken Back', class: 'status-taken-back' },
      'expired': { text: 'Expired', class: 'status-expired' }
    }
    
    const statusInfo = statusMap[status] || { text: status, class: 'status-unknown' }
    
    return <span className={`status-badge ${statusInfo.class}`}>{statusInfo.text}</span>
  }

  if (isLoading) {
    return (
      <div className="gift-list">
        <h2>📋 Gift List</h2>
        <div className="loading">Loading...</div>
      </div>
    )
  }

  return (
    <div className="gift-list">
      <h2>📋 Gift List</h2>
      
      {gifts.length === 0 ? (
        <div className="empty-state">
          <p>No gifts found</p>
          <p>Create your first gift!</p>
        </div>
      ) : (
        <div className="gifts-container">
          {gifts.map((gift, index) => (
            <div key={index} className="gift-item">
              <div className="gift-header">
                <span className="gift-id">{gift.id}</span>
                {getStatusBadge(gift.status)}
              </div>
              
              <div className="gift-details">
                <div className="detail-row">
                  <span className="label">Sender:</span>
                  <span className="value">{gift.sender}</span>
                </div>
                
                <div className="detail-row">
                  <span className="label">Recipient:</span>
                  <span className="value">{gift.recipient}</span>
                </div>
                
                <div className="detail-row">
                  <span className="label">Amount:</span>
                  <span className="value amount">{gift.amount}</span>
                </div>
                
                <div className="detail-row">
                  <span className="label">Created:</span>
                  <span className="value">{gift.createdAt}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <button onClick={loadGifts} className="refresh-btn">
        Refresh List
      </button>
    </div>
  )
} 