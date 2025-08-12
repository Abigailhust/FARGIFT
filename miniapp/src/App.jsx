import React, { useState } from 'react';
import { ConnectButton } from "./components/ConnectButton";
import { GiftCreator } from "./components/GiftCreator";
import { GiftUnwrapper } from "./components/GiftUnwrapper";
import { GiftList } from "./components/GiftList";
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('create');

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎁 FarGift</h1>
        <p>Create, share, and unwrap digital gifts on blockchain</p>
        <ConnectButton />
      </header>

      <nav className="App-nav">
        <button 
          className={activeTab === 'create' ? 'active' : ''} 
          onClick={() => setActiveTab('create')}
        >
          Create Gift
        </button>
        <button 
          className={activeTab === 'unwrap' ? 'active' : ''} 
          onClick={() => setActiveTab('unwrap')}
        >
          Unwrap Gift
        </button>
        <button 
          className={activeTab === 'list' ? 'active' : ''} 
          onClick={() => setActiveTab('list')}
        >
          Gift List
        </button>
      </nav>

      <main className="App-main">
        {activeTab === 'create' && <GiftCreator />}
        {activeTab === 'unwrap' && <GiftUnwrapper />}
        {activeTab === 'list' && <GiftList />}
      </main>
    </div>
  );
}

export default App; 