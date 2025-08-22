import React, { useState, useEffect, useRef } from 'react';
import './ControlPanel.css';

const ControlPanel = ({ items, onCorrectAnswer, onWrongAnswer, onRevealAll, teams, currentTeam, revealedItems = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const dropdownRef = useRef(null);

  // Filter items based on search term and revealedItems
  useEffect(() => {
    let visibleItems = items.filter(item => !revealedItems.includes(item.id));
    if (searchTerm.trim() === '') {
      setFilteredItems(visibleItems);
      return;
    }
    const filtered = visibleItems.filter(item => 
      item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [searchTerm, items, revealedItems]);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isDropdownOpen) return;
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleCorrectAnswer = () => {
    if (selectedItem) {
      onCorrectAnswer(selectedItem.id, currentTeam);
      setSearchTerm('');
      setSelectedItem(null);
      setIsDropdownOpen(false);
    }
  };

  const handleWrongAnswer = () => {
    onWrongAnswer(currentTeam);
  };

  const handleItemSelect = (item) => {
    setSelectedItem(item);
    setSearchTerm(item.answer);
    setIsDropdownOpen(false);
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen((open) => {
      if (open) {
        setSearchTerm('');
        setSelectedItem(null);
      }
      return !open;
    });
  };

  const handleInputFocus = () => {
    setIsDropdownOpen(true);
  };

  const handleRevealAllClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmRevealAll = () => {
    if (onRevealAll) {
      onRevealAll();
    }
    setShowConfirmDialog(false);
  };

  const handleCancelRevealAll = () => {
    setShowConfirmDialog(false);
  };

  console.log(teams);
  console.log(currentTeam);

  return (
    <div className="control-panel">
      <div className="control-header">
        <h3>Host Control Panel</h3>
        <div className="team-indicator">
          Active Team: <span className={`team-${currentTeam}`}>{teams[currentTeam]}</span>
        </div>
      </div>

      <div className="control-content">
        <div className="search-section">
          <label htmlFor="answer-dropdown">Select Answer:</label>
          <div className="dropdown-container" ref={dropdownRef}>
            <div className="dropdown-header" onMouseDown={handleDropdownToggle}>
              <input
                type="text"
                id="answer-dropdown"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Type to search or click to browse..."
                className="dropdown-input"
                onFocus={handleInputFocus}
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
              />
              <span className="dropdown-arrow" onMouseDown={e => e.stopPropagation()}>▼</span>
            </div>
            {isDropdownOpen && (
              <div className="dropdown-list">
                {filteredItems.length > 0 ? (
                  filteredItems.map(item => (
                    <div
                      key={item.id}
                      className={`dropdown-item ${selectedItem?.id === item.id ? 'selected' : ''}`}
                      onClick={() => handleItemSelect(item)}
                    >
                      <span className="item-number">{item.id}</span>
                      <span className="item-text">{item.answer}</span>
                    </div>
                  ))
                ) : (
                  <div className="dropdown-item no-results">
                    No items found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="action-buttons">
          <button
            className="correct-btn"
            onClick={handleCorrectAnswer}
            disabled={!selectedItem}
          >
            ✓ Correct Answer
          </button>
          <button
            className="wrong-btn"
            onClick={handleWrongAnswer}
          >
            ✗ Wrong Answer
          </button>
        </div>

        <div className="reveal-all-section">
          <button
            className="reveal-all-btn"
            onClick={handleRevealAllClick}
            disabled={revealedItems.length === items.length}
          >
            🔍 Reveal All Answers
          </button>
        </div>

        {selectedItem && (
          <div className="selected-item">
            <strong>Selected:</strong> #{selectedItem.id} - {selectedItem.answer}
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="confirm-overlay">
          <div className="confirm-dialog">
            <h4>⚠️ Confirm Reveal All</h4>
            <p>Are you sure you want to reveal ALL remaining answers?</p>
            <p className="warning-text">This action cannot be undone!</p>
            <div className="confirm-buttons">
              <button 
                className="confirm-cancel-btn" 
                onClick={handleCancelRevealAll}
              >
                Cancel
              </button>
              <button 
                className="confirm-reveal-btn" 
                onClick={handleConfirmRevealAll}
              >
                Yes, Reveal All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ControlPanel; 