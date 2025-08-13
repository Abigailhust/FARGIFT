# Transaction Interface Documentation

## Overview
This document describes the interface that needs to be implemented by another team to handle gift transactions on the blockchain.

## Required Function

### `window.sendGiftTransaction(transactionData)`

This function should be implemented globally on the `window` object to handle gift creation transactions.

#### Parameters
```javascript
transactionData: {
  recipients: string[],           // Array of recipient addresses (empty for public gifts)
  isPublic: boolean,             // Whether this is a public gift
  ethAmount: number,             // ETH amount in ETH units (e.g., 0.01)
  title?: string,                // Optional gift title
  description?: string,          // Optional gift description
  sender: string,                // Sender's wallet address
  timestamp: number              // Unix timestamp
}
```

#### Return Value
```javascript
Promise<string>  // Returns transaction hash when resolved
```

#### Example Implementation
```javascript
// This is what the other team needs to implement
window.sendGiftTransaction = async (transactionData) => {
  try {
    // 1. Prepare transaction parameters
    const { recipients, isPublic, ethAmount, title, description, sender } = transactionData;
    
    // 2. Call smart contract function (e.g., wrapPresent)
    const contract = getContract(); // Get contract instance
    const tx = await contract.wrapPresent(
      recipients,
      ethAmount,
      title || '',
      description || ''
    );
    
    // 3. Wait for transaction confirmation
    const receipt = await tx.wait();
    
    // 4. Return transaction hash
    return receipt.transactionHash;
    
  } catch (error) {
    console.error('Transaction failed:', error);
    throw error;
  }
};
```

## Integration Points

### 1. Smart Contract Integration
- The function should interact with the Present smart contract
- Use the contract address: `0x3B3cF7ee8dbCDDd8B8451e38269D982F351ca3db`
- Network: Arbitrum Sepolia (chainId: 421614)

### 2. Transaction Flow
1. **Validation**: Check if user has sufficient balance
2. **Contract Call**: Call the appropriate smart contract function
3. **Gas Estimation**: Estimate and set appropriate gas limits
4. **Transaction Signing**: Handle MetaMask transaction signing
5. **Confirmation**: Wait for transaction confirmation
6. **Return Hash**: Return the transaction hash

### 3. Error Handling
- Handle insufficient balance errors
- Handle network errors
- Handle user rejection errors
- Handle contract interaction errors

## Testing

### Test Transaction Data
```javascript
const testData = {
  recipients: ['0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6'],
  isPublic: false,
  ethAmount: 0.01,
  title: 'Test Gift',
  description: 'This is a test transaction',
  sender: '0x...', // User's wallet address
  timestamp: Date.now()
};

// Test the function
const hash = await window.sendGiftTransaction(testData);
console.log('Transaction hash:', hash);
```

## Notes

- The function should be available globally before the miniapp loads
- Handle both public and private gifts
- Support multiple recipients
- Ensure proper error handling and user feedback
- Consider gas optimization for better user experience
- The function should work with MetaMask and other Web3 wallets

## Contact
For questions about this interface, contact the team responsible for smart contract integration. 