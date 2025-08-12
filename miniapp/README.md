# 🎁 FARGIFT Mini App

A React-based frontend application for the on-chain gift system, designed to interact with FARGIFT smart contracts.

## ✨ Features

- 🔗 **Wallet Connection** - Support for MetaMask and other Ethereum wallets
- 🎯 **Live Presents** - View and claim active gifts in real-time
- 📚 **Historic Presents** - Browse completed and expired gifts
- 🎁 **Create Gifts** - Send ETH and tokens as gifts
- 🏠 **My Presents** - Manage your own gifts with filtering options
- 📱 **Responsive Design** - Mobile and desktop friendly

## 🚀 Quick Start

### Install Dependencies
```bash
npm install
```

### Start Development Server
```bash
npm run dev
```

The app will start at http://localhost:3000

### Build for Production
```bash
npm run build
```

## 🏗️ Project Structure

```
miniapp/
├── src/
│   ├── components/          # React Components
│   │   ├── ConnectButton.jsx    # Wallet connection button
│   │   ├── LivePresents.jsx     # Live gifts display and claiming
│   │   ├── HistoricPresents.jsx # Historical gifts browser
│   │   ├── GiftCreator.jsx      # Gift creation form
│   │   └── MyPresents.jsx       # User's own gifts management
│   ├── App.jsx             # Main application component
│   ├── main.jsx            # Application entry point
│   ├── App.css             # Main stylesheet
│   └── index.css           # Base styles
├── package.json            # Project configuration and dependencies
├── vite.config.js          # Vite build configuration
└── index.html              # HTML template
```

## 🔧 Tech Stack

- **React 18** - User interface framework
- **Vite** - Build tool and development server
- **CSS3** - Styling and animations
- **Web3** - Blockchain interaction (to be integrated)

## 📱 Usage Guide

### 1. Connect Wallet
- Click "Connect Wallet" button
- Authorize MetaMask connection
- Ensure connection to Arbitrum Sepolia testnet

### 2. Live Presents
- View active gifts available for claiming
- See gift details: sender, recipient, amount, limits
- Click "$ CLAIM!" to claim gifts
- Use "explore" button to view on blockchain

### 3. Historic Presents
- Browse completed, expired, and taken back gifts
- View detailed history and timestamps
- Explore transaction details on blockchain

### 4. Create Gift (New)
- Select "New" tab
- Enter recipient address (or select public gift)
- Input ETH amount
- Click "Create Gift" button

### 5. My Presents (Mine)
- View your own gifts with filtering options
- Filter by: All, Active, Unwrapped, Expired
- Take back gifts when possible
- Explore your gift transactions

## 🎯 Key Features

### **Live Presents**
- Real-time display of active gifts
- Claim functionality with limits
- Public vs. private gift support
- Direct blockchain exploration

### **Historic Presents**
- Complete gift history
- Status tracking (Unwrapped, Expired, Taken Back)
- Timestamp information
- Transaction exploration

### **Gift Management**
- Create new gifts with custom parameters
- Manage existing gifts
- Take back functionality
- Status monitoring

## 🔗 Smart Contract Integration

Current version uses mock data. Future integration will include:

- **Present.sol** - Main gift contract
- **WrappedPresentNFT.sol** - Wrapped gift NFT
- **UnwrappedPresentNFT.sol** - Unwrapped gift NFT

## 🌐 Network Configuration

- **Testnet**: Arbitrum Sepolia (chainId: 421614)
- **Contract Address**: 0x3B3cF7ee8dbCDDd8B8451e38269D982F351ca3db

## 📝 Development Roadmap

- [ ] Integrate Web3 libraries and smart contracts
- [ ] Add token support (ERC20)
- [ ] Implement event listening and real-time updates
- [ ] Add gift search and filtering
- [ ] Optimize mobile experience
- [ ] Add multi-language support
- [ ] Implement gift claiming with smart contracts
- [ ] Add real-time status updates

## 🤝 Contributing

Issues and Pull Requests are welcome!

## 📄 License

MIT License 