import React, { useState } from 'react';
import './GameSetup.css';

const GameSetup = ({ onStartGame }) => {
  const [title, setTitle] = useState('OCHO OVERTIME');
  const [items, setItems] = useState('');
  const [team1, setTeam1] = useState('');
  const [team2, setTeam2] = useState('');

  const teams = [
    'Bonnies NIL Collective',
    'Chickenhawks',
    'Frankchester United',
    'Herbstreit Vick Pet Clinic',
    'Hive Mind',
    'Hypnotoads',
    'Lick My Qualls',
    'Mentally Illest',
    'Night Pandas',
    'Pool Boy',
    'Scarlet Knights',
    'Simple Jacks'
  ];

  const handleStartGame = () => {
    const itemsList = items
      .split('\n')
      .map(item => item.trim())
      .filter(item => item.length > 0)
      .map((item, index) => ({
        id: index + 1,
        answer: item,
        revealed: false
      }));

    if (itemsList.length === 0) {
      alert('Please enter at least one trivia item');
      return;
    }

    if (!team1 || !team2) {
      alert('Please select both teams');
      return;
    }

    if (team1 === team2) {
      alert('Please select different teams');
      return;
    }

    onStartGame({
      title: title.trim() || 'OCHO OVERTIME',
      items: itemsList,
      teams: [team1, team2]
    });
  };

  const handleLoadSampleData = () => {
    setTitle('OCHO OVERTIME');
    setTeam1('Lick My Qualls');
    setTeam2('Mentally Illest');
    setItems(`Pizza
Coffee
Netflix
Beach
Chocolate
Music
Books
Travel
Friends
Sleep
Food
Movies
Exercise
Art
Nature
Technology
Animals
Sports
Cooking
Photography
Dancing
Writing
Gaming
Shopping
Meditation`);
  };

  return (
    <div className="game-setup">
      <div className="setup-container">
        <h1>Game Setup</h1>
        
        <div className="setup-form">
          <div className="form-group">
            <label htmlFor="title">Game Title:</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter game title..."
              className="title-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="team1">Team 1:</label>
            <select
              id="team1"
              value={team1}
              onChange={(e) => setTeam1(e.target.value)}
              className="team-select"
            >
              <option value="">Select Team 1</option>
              {teams.map(team => (
                <option key={team} value={team}>{team}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="team2">Team 2:</label>
            <select
              id="team2"
              value={team2}
              onChange={(e) => setTeam2(e.target.value)}
              className="team-select"
            >
              <option value="">Select Team 2</option>
              {teams.map(team => (
                <option key={team} value={team}>{team}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="items">Trivia Items (one per line):</label>
            <textarea
              id="items"
              value={items}
              onChange={(e) => setItems(e.target.value)}
              placeholder="Enter trivia items, one per line..."
              className="items-textarea"
              rows="15"
            />
            <div className="items-count">
              Items: {items.split('\n').filter(item => item.trim().length > 0).length}
            </div>
          </div>

          <div className="setup-buttons">
            <button 
              className="load-sample-btn" 
              onClick={handleLoadSampleData}
            >
              Load Sample Data
            </button>
            <button 
              className="start-game-btn" 
              onClick={handleStartGame}
              disabled={items.split('\n').filter(item => item.trim().length > 0).length === 0 || !team1 || !team2}
            >
              Start Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameSetup; 