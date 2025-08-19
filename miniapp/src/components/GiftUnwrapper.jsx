import React, { useState } from 'react'

export function GiftUnwrapper() {
  const [giftId, setGiftId] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleUnwrap = async (e) => {
    e.preventDefault()
    
    if (!giftId.trim()) {
      alert('Please enter gift ID')
      return
    }

    setIsLoading(true)
    
    try {
      // TODO: Call smart contract to unwrap gift
      console.log('Unwrapping gift:', giftId)
      
      alert('Gift unwrapped successfully!')
      setGiftId('')
    } catch (error) {
      console.error('Failed to unwrap gift:', error)
      alert('Failed to unwrap gift: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="gift-unwrapper">
      <form onSubmit={handleUnwrap} className="unwrap-form">
        <div className="form-group">
          <label>Gift ID:</label>
          <input
            type="text"
            value={giftId}
            onChange={(e) => setGiftId(e.target.value)}
            placeholder="Enter gift ID..."
            disabled={isLoading}
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={isLoading}
        >
          {isLoading ? 'Unwrapping...' : 'Unwrap Gift'}
        </button>
      </form>

      <div className="help-text">
        <p>💡 Tips:</p>
        <ul>
          <li>Enter gift ID to unwrap the gift</li>
          <li>Only designated recipients or anyone for public gifts can unwrap</li>
          <li>Assets in the gift will be transferred to your wallet after unwrapping</li>
        </ul>
      </div>
    </div>
  )
} 