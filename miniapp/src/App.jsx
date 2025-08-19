import React, { useState } from 'react';
import { ConnectButton } from "./components/ConnectButton";
import { GiftCreator } from "./components/GiftCreator";
import { GiftUnwrapper } from "./components/GiftUnwrapper";
import { GiftList } from "./components/GiftList";
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('list');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎁 FarGift</h1>
        <p>Create, share, and unwrap digital gifts on blockchain</p>
        <ConnectButton />
      </header>

      {/* 主要内容区域 - 显示 Gift List */}
      <main className="App-main">
        <GiftList />
      </main>

      {/* 底部固定按钮栏 - Telegram 风格 */}
      <div className="bottom-nav">
        <button 
          className="bottom-nav-btn create-btn"
          onClick={() => openModal('create')}
        >
          <span className="btn-icon">🎁</span>
          <span className="btn-text">Create Gift</span>
        </button>
        
        <button 
          className="bottom-nav-btn unwrap-btn"
          onClick={() => openModal('unwrap')}
        >
          <span className="btn-icon">🎉</span>
          <span className="btn-text">Unwrap Gift</span>
        </button>
      </div>

      {/* 模态框 */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {modalType === 'create' ? '🎁 Create New Gift' : '🎉 Unwrap Gift'}
              </h2>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            
            <div className="modal-body">
              {modalType === 'create' && <GiftCreator />}
              {modalType === 'unwrap' && <GiftUnwrapper />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App; 