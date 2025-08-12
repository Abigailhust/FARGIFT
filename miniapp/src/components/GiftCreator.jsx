import React, { useState } from 'react'

export function GiftCreator() {
  const [recipient, setRecipient] = useState('')
  const [ethAmount, setEthAmount] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!recipient && !isPublic) {
      alert('Please enter recipient address or select public gift')
      return
    }

    if (!ethAmount || parseFloat(ethAmount) <= 0) {
      alert('Please enter a valid ETH amount')
      return
    }

    setIsLoading(true)
    
    try {
      // TODO: Call smart contract to create gift
      console.log('Creating gift:', {
        recipient: isPublic ? 'Public' : recipient,
        ethAmount: parseFloat(ethAmount),
        isPublic
      })
      
      alert('Gift created successfully!')
      setRecipient('')
      setEthAmount('')
    } catch (error) {
      console.error('Failed to create gift:', error)
      alert('Failed to create gift: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="gift-creator">
      <h2>🎁 Create New Gift</h2>
      
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
            <label>Recipient Address:</label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="0x..."
              disabled={isLoading}
            />
          </div>
        )}

        <div className="form-group">
          <label>ETH Amount:</label>
          <input
            type="number"
            value={ethAmount}
            onChange={(e) => setEthAmount(e.target.value)}
            placeholder="0.01"
            step="0.001"
            min="0.001"
            disabled={isLoading}
          />
        </div>

        <button 
          type="submit" 
          className="submit-btn"
          disabled={isLoading}
        >
          {isLoading ? 'Creating...' : 'Create Gift'}
        </button>
      </form>
    </div>
  )
} 