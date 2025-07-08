import React, { useState, useEffect, useCallback } from 'react';
import './TriviaBoard.css';

const TriviaBoard = ({ gameState, onReset, title = "OCHO OVERTIME", items = [], onRevealItem, resetKey }) => {
  const [revealedItems, setRevealedItems] = useState(new Set());
  const [flippingItems, setFlippingItems] = useState(new Set());

  // Reset board when resetKey changes
  useEffect(() => {
    setRevealedItems(new Set());
    setFlippingItems(new Set());
  }, [resetKey]);

  const handleReveal = useCallback((id) => {
    if (revealedItems.has(id) || flippingItems.has(id)) return;
    
    // Start the flip animation and immediately mark as revealed for styling
    setFlippingItems(prev => new Set(prev).add(id));
    setRevealedItems(prev => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
    
    // After animation completes, allow text to be shown
    setTimeout(() => {
      setFlippingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }, 600); // Match the animation duration
  }, [revealedItems, flippingItems]);

  // Handle external reveal from control panel
  useEffect(() => {
    if (onRevealItem) {
      onRevealItem(handleReveal);
    }
  }, [onRevealItem, handleReveal]);

  const handleReset = () => {
    setRevealedItems(new Set());
    setFlippingItems(new Set());
    if (onReset) {
      onReset();
    }
  };

  // Use provided items or fall back to sample data
  const triviaItems = items.length > 0 ? items : [
    { id: 1, answer: "Pizza", revealed: false },
    { id: 2, answer: "Coffee", revealed: false },
    { id: 3, answer: "Netflix", revealed: false },
    { id: 4, answer: "Beach", revealed: false },
    { id: 5, answer: "Chocolate", revealed: false },
    { id: 6, answer: "Music", revealed: false },
    { id: 7, answer: "Books", revealed: false },
    { id: 8, answer: "Travel", revealed: false },
    { id: 9, answer: "Friends", revealed: false },
    { id: 10, answer: "Sleep", revealed: false },
    { id: 11, answer: "Food", revealed: false },
    { id: 12, answer: "Movies", revealed: false },
    { id: 13, answer: "Exercise", revealed: false },
    { id: 14, answer: "Art", revealed: false },
    { id: 15, answer: "Nature", revealed: false },
    { id: 16, answer: "Technology", revealed: false },
    { id: 17, answer: "Animals", revealed: false },
    { id: 18, answer: "Sports", revealed: false },
    { id: 19, answer: "Cooking", revealed: false },
    { id: 20, answer: "Photography", revealed: false },
    { id: 21, answer: "Dancing", revealed: false },
    { id: 22, answer: "Writing", revealed: false },
    { id: 23, answer: "Gaming", revealed: false },
    { id: 24, answer: "Shopping", revealed: false },
    { id: 25, answer: "Meditation", revealed: false },
  ];

  return (
    <div className="trivia-board">
      <div className="board-title">
        <h1>{title}</h1>
      </div>
      
      <div className="board-grid">
        {triviaItems.map((item) => {
          const isRevealed = revealedItems.has(item.id);
          const isFlipping = flippingItems.has(item.id);
          
          return (
            <div
              key={item.id}
              className={`board-item ${isRevealed ? 'revealed' : ''} ${isFlipping ? 'flipping' : ''}`}
              onClick={() => handleReveal(item.id)}
            >
              <div className="item-number">{item.id}</div>
              <div className="item-answer">
                {isRevealed && !isFlipping ? item.answer : ''}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TriviaBoard; 