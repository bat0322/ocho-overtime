import React from 'react';
import './GameVerification.css';

const GameVerification = ({ gameConfig, onConfirm, onBack }) => {
  const { title, items } = gameConfig;

  return (
    <div className="game-verification">
      <div className="verification-container">
        <h1>Review Your Game</h1>
        
        <div className="verification-content">
          <div className="verification-section">
            <h2>Game Title</h2>
            <div className="title-display">{title}</div>
          </div>

          <div className="verification-section">
            <h2>Trivia Items ({items.length})</h2>
            <div className="items-grid">
              {items.map((item, index) => (
                <div key={item.id} className="item-preview">
                  <div className="item-number">{item.id}</div>
                  <div className="item-text">{item.answer}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="verification-actions">
            <button className="back-btn" onClick={onBack}>
              ← Back to Setup
            </button>
            <button className="confirm-btn" onClick={onConfirm}>
              Start Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameVerification; 