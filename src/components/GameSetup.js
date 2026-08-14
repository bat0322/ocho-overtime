import React, { useState, useEffect } from 'react';
import './GameSetup.css';
import { loadOvertimes, saveOvertime, updateOvertime, deleteOvertime } from '../utils/overtimeStorage';

const GameSetup = ({ onStartGame }) => {
  const [title, setTitle] = useState('');
  const [items, setItems] = useState('');
  const [team1, setTeam1] = useState('');
  const [team2, setTeam2] = useState('');
  const [savedOvertimes, setSavedOvertimes] = useState([]);
  const [loadedOvertimeId, setLoadedOvertimeId] = useState(null);
  const [savedOpen, setSavedOpen] = useState(false);

  const teams = [
    'Bonnies NIL Collective',
    'Chickenhawks',
    'Frankchester United',
    'Herbstreit Vick Pet Clinic',
    'Hive Mind',
    'Humongous Melonheads',
    'Hypnotoads',
    'Lick My Qualls',
    'Mentally Illest',
    'Night Pandas',
    'Sugar Boogers',
    'Scarlet Knights'
  ];

  useEffect(() => {
    setSavedOvertimes(loadOvertimes());
  }, []);

  const refreshSaved = () => setSavedOvertimes(loadOvertimes());

  const handleSaveOvertime = () => {
    const trimmedTitle = title.trim() || 'OCHO OVERTIME';
    const trimmedItems = items.trim();
    if (!trimmedItems) {
      alert('Please enter at least one trivia item before saving');
      return;
    }
    if (loadedOvertimeId !== null) {
      updateOvertime(loadedOvertimeId, trimmedTitle, trimmedItems);
    } else {
      const entry = saveOvertime(trimmedTitle, trimmedItems);
      setLoadedOvertimeId(entry.id);
    }
    refreshSaved();
  };

  const handleLoadOvertime = (overtime) => {
    setTitle(overtime.title);
    setItems(overtime.items);
    setLoadedOvertimeId(overtime.id);
  };

  const handleDeleteOvertime = (id) => {
    deleteOvertime(id);
    if (loadedOvertimeId === id) setLoadedOvertimeId(null);
    refreshSaved();
  };

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

    if (!title.trim()) {
      alert('Please enter a category title');
      return;
    }

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
      title: title.trim(),
      items: itemsList,
      teams: [team1, team2],
      overtimeId: loadedOvertimeId
    });
  };

  const handleLoadSampleData = () => {
    setTitle('25 Largest Countries');
    setTeam1('Lick My Qualls');
    setTeam2('Mentally Illest');
    setLoadedOvertimeId(null);
    setItems(`Russia
Canada
United States
China
Brazil
Australia
India
Argentina
Kazakhstan
Algeria
Democratic Republic of the Congo
Saudi Arabia
Mexico
Indonesia
Sudan
Libya
Iran
Mongolia
Peru
Chad
Niger
Angola
Mali
South Africa
Colombia`);
  };

  const itemCount = items.split('\n').filter(item => item.trim().length > 0).length;
  const isSaved = loadedOvertimeId !== null;

  return (
    <div className="game-setup">
      <div className="setup-container">
        <h1>Game Setup</h1>

        {savedOvertimes.length > 0 && (
          <div className="saved-overtimes">
            <div className="saved-overtimes-header-row">
              <button
                className="saved-overtimes-toggle"
                onClick={() => setSavedOpen(o => !o)}
              >
                <span>Saved Overtimes ({savedOvertimes.length})</span>
                <span className={`toggle-chevron${savedOpen ? ' open' : ''}`}>▾</span>
              </button>
              <button
                className="pick-random-btn"
                onClick={() => {
                  const unused = savedOvertimes.filter(o => !o.used);
                  if (unused.length === 0) {
                    alert('No unused overtimes left!');
                    return;
                  }
                  handleLoadOvertime(unused[Math.floor(Math.random() * unused.length)]);
                }}
              >
                Pick Random
              </button>
            </div>
            <div className={`saved-overtimes-list${savedOpen ? ' expanded' : ''}`}>
              {savedOvertimes.map(ot => {
                const count = ot.items.split('\n').filter(s => s.trim()).length;
                const isLoaded = loadedOvertimeId === ot.id;
                return (
                  <div key={ot.id} className={`saved-overtime-row${isLoaded ? ' loaded' : ''}`}>
                    <div className="saved-overtime-info">
                      <span className="saved-overtime-title">{ot.title}</span>
                      <span className="saved-overtime-meta">{count} items</span>
                      {ot.used && <span className="used-badge">Used</span>}
                    </div>
                    <div className="saved-overtime-actions">
                      <button
                        className="ot-action-btn load-btn"
                        onClick={() => handleLoadOvertime(ot)}
                        disabled={isLoaded}
                      >
                        {isLoaded ? 'Loaded' : 'Load'}
                      </button>
                      <button
                        className="ot-action-btn delete-btn"
                        onClick={() => handleDeleteOvertime(ot.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="setup-form">
          <div className="form-group">
            <label htmlFor="title">Category Title:</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => { setTitle(e.target.value); }}
              placeholder="e.g. 25 Largest Countries"
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
              Items: {itemCount}
            </div>
          </div>

          <div className="setup-buttons">
            <button
              className="load-sample-btn"
              onClick={handleLoadSampleData}
            >
              Load Sample
            </button>
            <button
              className="save-overtime-btn"
              onClick={handleSaveOvertime}
              disabled={itemCount === 0}
            >
              {isSaved ? 'Update Saved' : 'Save Overtime'}
            </button>
            <button
              className="start-game-btn"
              onClick={handleStartGame}
              disabled={!title.trim() || itemCount === 0 || !team1 || !team2}
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
