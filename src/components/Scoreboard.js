import React, { useState, useEffect } from 'react';
import './Scoreboard.css';
import { getTeamColors, getTeamLogo } from '../utils/teamUtils';

const Scoreboard = ({ onGameStateChange, onScoreUpdate, onTeamToggle, currentTeam = 1, resetKey, teams, setTeams }) => {
  // Use teams and setTeams from props (lifted state)
  // Use currentTeam from props



  const toggleCircle = (teamIndex, circleIndex) => {
    setTeams(prevTeams => {
      const newTeams = [...prevTeams];
      const currentState = newTeams[teamIndex].circles[circleIndex];
      
      // Cycle through: empty -> green -> red -> empty
      let newState;
      if (currentState === 'empty') {
        newState = 'green';
      } else if (currentState === 'green') {
        newState = 'red';
      } else {
        newState = 'empty';
      }
      
      newTeams[teamIndex].circles[circleIndex] = newState;
      return newTeams;
    });
    if (onGameStateChange) {
      onGameStateChange({
        currentTeam: teams[currentTeam],
        teams
      });
    }
  };

  const handleCorrectAnswer = (teamId) => {
    console.log('handleCorrectAnswer called with teamId:', teamId);
    // Find the next empty circle for the team
    const teamIndex = teamId;
    const team = teams[teamIndex];
    const nextEmptyIndex = team.circles.findIndex(circle => circle === 'empty');
    
    if (nextEmptyIndex !== -1) {
      setTeams(prevTeams => {
        const newTeams = [...prevTeams];
        newTeams[teamIndex].circles[nextEmptyIndex] = 'green';
        return newTeams;
      });
    }

    // Switch to the other team
    const newTeam = teamId === 0 ? 1 : 0;
    if (onTeamToggle) {
      onTeamToggle(newTeam);
    }
    if (onGameStateChange) {
      onGameStateChange({
        currentTeam: teams[newTeam],
        teams
      });
    }
  };

  const handleWrongAnswer = (teamId) => {
    console.log('handleWrongAnswer called with teamId:', teamId);
    // Find the next empty circle for the team
    const teamIndex = teamId;
    const team = teams[teamIndex];
    const nextEmptyIndex = team.circles.findIndex(circle => circle === 'empty');
    
    if (nextEmptyIndex !== -1) {
      setTeams(prevTeams => {
        const newTeams = [...prevTeams];
        newTeams[teamIndex].circles[nextEmptyIndex] = 'red';
        return newTeams;
      });
    }

    // Switch to the other team
    const newTeam = teamId === 0 ? 1 : 0;
    if (onTeamToggle) {
      onTeamToggle(newTeam);
    }
    if (onGameStateChange) {
      onGameStateChange({
        currentTeam: teams[newTeam],
        teams
      });
    }
  };

  // Reset both teams' circles to empty if all are filled, after the UI updates
  useEffect(() => {
    const allFilled = teams.every(t => t.circles.every(c => c !== 'empty'));
    if (allFilled) {
      const timer = setTimeout(() => {
        setTeams(prevTeams => prevTeams.map(t => ({ ...t, circles: ['empty', 'empty', 'empty', 'empty', 'empty'] })));
      }, 500); // Give a short delay so the last answer is visible
      return () => clearTimeout(timer);
    }
  }, [teams, setTeams]);

  // Expose methods to parent component
  useEffect(() => {
    if (onScoreUpdate) {
      onScoreUpdate({
        handleCorrectAnswer,
        handleWrongAnswer
      });
    }
  }, [onScoreUpdate, teams, setTeams]);

  return (
    <div className="scoreboard-compact">
      {/* Team 1 Score Bug - Top Left */}
      <div 
        className={`score-bug team1 ${currentTeam === 0 ? 'active' : ''}`}
        style={{
          background: `linear-gradient(135deg, ${getTeamColors(teams[0].name).primary}CC, ${getTeamColors(teams[0].name).secondary}CC)`,
          borderColor: currentTeam === 0 ? getTeamColors(teams[0].name).primary : getTeamColors(teams[0].name).secondary,
          opacity: currentTeam === 0 ? 1 : 0.6,
          transform: currentTeam === 0 ? 'scale(1.05)' : 'scale(1)',
          boxShadow: currentTeam === 0 ? `0 0 25px ${getTeamColors(teams[0].name).primary}CC` : '0 10px 30px rgba(0, 0, 0, 0.4)'
        }}
      >
        <div className="logo-container">
          {getTeamLogo(teams[0].name) ? (
            <img 
              src={`${process.env.PUBLIC_URL}/logos/${getTeamLogo(teams[0].name)}`} 
              alt={teams[0].name || 'Team 1'} 
              className="team-logo"
            />
          ) : (
            teams[0].name || 'T1'
          )}
        </div>
        
        <div className="circles-container">
          {teams[0].circles.map((circle, index) => (
            <button
              key={index}
              className={`score-circle ${circle}`}
              onClick={() => toggleCircle(0, index)}
              title={`Click to cycle: ${circle === 'empty' ? 'Empty → Green' : circle === 'green' ? 'Green → Red' : 'Red → Empty'}`}
            >
              {circle === 'green' && '✓'}
              {circle === 'red' && '✗'}
            </button>
          ))}
        </div>
      </div>

      {/* Team 2 Score Bug - Top Right */}
      <div 
        className={`score-bug team2 ${currentTeam === 0 ? 'active' : ''}`}
        style={{
          background: `linear-gradient(135deg, ${getTeamColors(teams[1].name).primary}CC, ${getTeamColors(teams[1].name).secondary}CC)`,
          borderColor: currentTeam === 1 ? getTeamColors(teams[1].name).primary : getTeamColors(teams[1].name).secondary,
          opacity: currentTeam === 1 ? 1 : 0.6,
          transform: currentTeam === 1 ? 'scale(1.05)' : 'scale(1)',
          boxShadow: currentTeam === 1 ? `0 0 25px ${getTeamColors(teams[1].name).primary}CC` : '0 10px 30px rgba(0, 0, 0, 0.4)'
        }}
      >
        <div className="logo-container">
          {getTeamLogo(teams[1].name) ? (
            <img 
              src={`${process.env.PUBLIC_URL}/logos/${getTeamLogo(teams[1].name)}`} 
              alt={teams[1].name || 'Team 2'} 
              className="team-logo"
            />
          ) : (
            teams[1].name || 'T2'
          )}
        </div>
        
        <div className="circles-container">
          {teams[1].circles.map((circle, index) => (
            <button
              key={index}
              className={`score-circle ${circle}`}
              onClick={() => toggleCircle(1, index)}
              title={`Click to cycle: ${circle === 'empty' ? 'Empty → Green' : circle === 'green' ? 'Green → Red' : 'Red → Empty'}`}
            >
              {circle === 'green' && '✓'}
              {circle === 'red' && '✗'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Scoreboard; 