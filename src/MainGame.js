import React, { useState, useCallback, useRef, useEffect } from 'react';
import Scoreboard from './components/Scoreboard';
import TriviaBoard from './components/TriviaBoard';
import GameSetup from './components/GameSetup';
import GameVerification from './components/GameVerification';
import './App.css';

function MainGame() {
  const [gameState, setGameState] = useState({
    currentTeam: null,
    gamePhase: 'bestOf5',
    round: 1,
    teams: []
  });
  const [gameConfig, setGameConfig] = useState(null);
  const [currentMode, setCurrentMode] = useState('setup');
  const [currentTeam, setCurrentTeam] = useState(1);
  const scoreUpdateMethodsRef = useRef(null);
  const [revealedItems, setRevealedItems] = useState(new Set());
  const [resetKey, setResetKey] = useState(0);
  const revealMethodRef = useRef(null);
  const channelRef = useRef(null);
  const [teams, setTeams] = useState([
    { id: 1, name: '', circles: ['empty', 'empty', 'empty', 'empty', 'empty'] },
    { id: 2, name: '', circles: ['empty', 'empty', 'empty', 'empty', 'empty'] }
  ]);

  // Setup BroadcastChannel
  useEffect(() => {
    channelRef.current = new window.BroadcastChannel('ocho-overtime');
    const channel = channelRef.current;
    channel.onmessage = (event) => {
      const { type, itemId, teamId } = event.data;
      if (type === 'REQUEST_SYNC') {
        channel.postMessage({
          type: 'SYNC_STATE',
          gameConfig,
          currentTeam,
          revealedItems: Array.from(revealedItems),
        });
      }
      if (type === 'CORRECT_ANSWER') {
        if (revealMethodRef.current) {
          revealMethodRef.current(itemId);
        }
        if (scoreUpdateMethodsRef.current) {
          scoreUpdateMethodsRef.current.handleCorrectAnswer(teamId);
        }
      }
      if (type === 'WRONG_ANSWER') {
        if (scoreUpdateMethodsRef.current) {
          scoreUpdateMethodsRef.current.handleWrongAnswer(teamId);
        }
      }
    };
    return () => channel.close();
  }, [gameConfig, currentTeam, revealedItems]);

  // Broadcast SYNC_STATE whenever revealedItems, currentTeam, or gameConfig changes
  useEffect(() => {
    if (channelRef.current) {
      channelRef.current.postMessage({
        type: 'SYNC_STATE',
        gameConfig,
        currentTeam,
        revealedItems: Array.from(revealedItems),
      });
    }
  }, [revealedItems, currentTeam, gameConfig]);

  const handleGameStateChange = (newState) => {
    setGameState(newState);
  };

  const handleStartGame = (config) => {
    setGameConfig(config);
    setTeams([
      { id: 1, name: config.team1, circles: ['empty', 'empty', 'empty', 'empty', 'empty'] },
      { id: 2, name: config.team2, circles: ['empty', 'empty', 'empty', 'empty', 'empty'] }
    ]);
    setCurrentMode('verification');
  };

  const handleConfirmGame = () => {
    setCurrentMode('game');
    // Open the control panel popup automatically
    window.open(`${window.location.origin}${window.location.pathname}#/control-panel`, 'HostControlPanel', 'width=420,height=700');
  };

  const handleBackToSetup = () => {
    setCurrentMode('setup');
    setGameConfig(null);
  };

  const handleReset = () => {
    setRevealedItems(new Set());
    setResetKey(k => k + 1);
    scoreUpdateMethodsRef.current = null;
    setTeams([
      { id: 1, name: gameConfig?.team1 || '', circles: ['empty', 'empty', 'empty', 'empty', 'empty'] },
      { id: 2, name: gameConfig?.team2 || '', circles: ['empty', 'empty', 'empty', 'empty', 'empty'] }
    ]);
  };

  const handleExit = () => {
    setCurrentMode('setup');
    setGameConfig(null);
    setGameState({
      currentTeam: null,
      gamePhase: 'bestOf5',
      round: 1,
      teams: []
    });
    setCurrentTeam(1);
    setRevealedItems(new Set());
  };

  const handleTeamToggle = (newTeam) => {
    setCurrentTeam(newTeam);
  };

  const handleScoreUpdate = useCallback((methods) => {
    scoreUpdateMethodsRef.current = methods;
  }, []);

  // Wrap the reveal method to also update revealedItems
  const handleRevealItem = useCallback((method) => {
    revealMethodRef.current = (id) => {
      setRevealedItems(prev => new Set(prev).add(id));
      method(id);
    };
  }, []);

  // Button to open the control panel popup
  const openControlPanelWindow = () => {
    window.open(`${window.location.origin}${window.location.pathname}#/control-panel`, 'HostControlPanel', 'width=420,height=700');
  };

  if (currentMode === 'setup') {
    return <GameSetup onStartGame={handleStartGame} />;
  }

  if (currentMode === 'verification') {
    return (
      <GameVerification 
        gameConfig={gameConfig}
        onConfirm={handleConfirmGame}
        onBack={handleBackToSetup}
      />
    );
  }

  return (
    <div className="App">
      <div className="game-container">
        <Scoreboard 
          onGameStateChange={handleGameStateChange}
          onScoreUpdate={handleScoreUpdate}
          onTeamToggle={handleTeamToggle}
          currentTeam={currentTeam}
          teams={teams}
          setTeams={setTeams}
          resetKey={resetKey}
        />
        <TriviaBoard 
          gameState={gameState}
          onReset={handleReset}
          title={gameConfig.title}
          items={gameConfig.items}
          onRevealItem={handleRevealItem}
          resetKey={resetKey}
        />
      </div>
      {/* Floating Reset Button */}
      <button className="floating-reset-button" onClick={handleReset} title="Reset Board">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 4V10H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3.51 15A9 9 0 1 0 6 5L1 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {/* Floating Exit Button */}
      <button className="floating-exit-button" onClick={handleExit} title="Exit to Setup">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
}

export default MainGame; 