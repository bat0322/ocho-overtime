import React, { useState, useEffect } from 'react';
import './Scoreboard.css';

const Scoreboard = ({ onGameStateChange, onScoreUpdate, onTeamToggle, currentTeam = 1, resetKey, teams, setTeams }) => {
  // Use teams and setTeams from props (lifted state)
  // Use currentTeam from props

  const getTeamLogo = (teamName) => {
    const logoMap = {
      'Bonnies NIL Collective': 'bonnies_nil_collective_logo.png',
      'Chickenhawks': 'chickenhawks_logo.png',
      'Frankchester United': 'frankchester_logo.png',
      'Herbstreit Vick Pet Clinic': 'herbstreit_vick_pet_clinic_logo.png',
      'Hive Mind': 'hive_mind_logo.png',
      'Hypnotoads': 'hypnotoads_logo.png',
      'Lick My Qualls': 'lick_my_qualls_logo.png',
      'Mentally Illest': 'mentally_illest_logo.png',
      'Night Pandas': 'night_pandas_logo.png',
      'Pool Boy': 'pool_boy_logo.png',
      'Scarlet Knights': 'scarlet_knights_logo.png',
      'Simple Jacks': 'simple_jacks_logo.png'
    };
    return logoMap[teamName] || null;
  };

  const getTeamColors = (teamName) => {
    const colorMap = {
      'Bonnies NIL Collective': { primary: '#66372B', secondary: '#E6CA97' }, // Black/White
      'Chickenhawks': { primary: '#4C7239', secondary: '#FFFFFF' }, // Green/White
      'Frankchester United': { primary: '#ED88E1', secondary: '#FBE64D' }, // Pink/Yellow
      'Herbstreit Vick Pet Clinic': { primary: '#001F5D', secondary: '#ECCF65' }, // Black/White
      'Hive Mind': { primary: '#F4CB54', secondary: '#000000' }, // Gold/Black
      'Hypnotoads': { primary: '#6A288B', secondary: '#3D1848' }, // Purple/Dark Purple
      'Lick My Qualls': { primary: '#EA3324', secondary: '#FFFFFF' }, // Red/White
      'Mentally Illest': { primary: '#EA983F', secondary: '#FFFFFF' }, // Orange/White
      'Night Pandas': { primary: '#000000', secondary: '#65A542' }, // Black/Green
      'Pool Boy': { primary: '#A32E2D', secondary: '#0E224A' }, // Red/Dark Blue
      'Scarlet Knights': { primary: '#CE4146', secondary: '#D1D1D1' }, // Red/Light Gray
      'Simple Jacks': { primary: '#882111', secondary: '#F5C242' } // Dark Red/Gold
    };
    return colorMap[teamName] || { primary: '#3498db', secondary: '#2980b9' };
  };

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
        currentTeam: teams[currentTeam - 1],
        teams
      });
    }
  };

  const handleCorrectAnswer = (teamId) => {
    console.log('handleCorrectAnswer called with teamId:', teamId);
    // Find the next empty circle for the team
    const teamIndex = teamId - 1;
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
    const newTeam = teamId === 1 ? 2 : 1;
    if (onTeamToggle) {
      onTeamToggle(newTeam);
    }
    if (onGameStateChange) {
      onGameStateChange({
        currentTeam: teams[newTeam - 1],
        teams
      });
    }
  };

  const handleWrongAnswer = (teamId) => {
    console.log('handleWrongAnswer called with teamId:', teamId);
    // Find the next empty circle for the team
    const teamIndex = teamId - 1;
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
    const newTeam = teamId === 1 ? 2 : 1;
    if (onTeamToggle) {
      onTeamToggle(newTeam);
    }
    if (onGameStateChange) {
      onGameStateChange({
        currentTeam: teams[newTeam - 1],
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
        className={`score-bug team1 ${currentTeam === 1 ? 'active' : ''}`}
        style={{
          background: `linear-gradient(135deg, ${getTeamColors(teams[0].name).primary}CC, ${getTeamColors(teams[0].name).secondary}CC)`,
          borderColor: currentTeam === 1 ? getTeamColors(teams[0].name).primary : getTeamColors(teams[0].name).secondary,
          opacity: currentTeam === 1 ? 1 : 0.6,
          transform: currentTeam === 1 ? 'scale(1.05)' : 'scale(1)',
          boxShadow: currentTeam === 1 ? `0 0 25px ${getTeamColors(teams[0].name).primary}CC` : '0 10px 30px rgba(0, 0, 0, 0.4)'
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
        className={`score-bug team2 ${currentTeam === 2 ? 'active' : ''}`}
        style={{
          background: `linear-gradient(135deg, ${getTeamColors(teams[1].name).primary}CC, ${getTeamColors(teams[1].name).secondary}CC)`,
          borderColor: currentTeam === 2 ? getTeamColors(teams[1].name).primary : getTeamColors(teams[1].name).secondary,
          opacity: currentTeam === 2 ? 1 : 0.6,
          transform: currentTeam === 2 ? 'scale(1.05)' : 'scale(1)',
          boxShadow: currentTeam === 2 ? `0 0 25px ${getTeamColors(teams[1].name).primary}CC` : '0 10px 30px rgba(0, 0, 0, 0.4)'
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