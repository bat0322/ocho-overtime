import React, { useRef, useEffect, useState } from 'react';
import ControlPanel from './components/ControlPanel';

// Dummy items and team for initial render; you can improve this by syncing state from the main window if needed
const defaultItems = [];

function ControlPanelPage() {
  const channelRef = useRef(null);
  const [items, setItems] = useState([]);
  const [currentTeam, setCurrentTeam] = useState(0);
  const [teams, setTeams] = useState([]);
  const [revealedItems, setRevealedItems] = useState([]);

  // Create the channel only once
  if (!channelRef.current) {
    channelRef.current = new window.BroadcastChannel('ocho-overtime');
  }

  useEffect(() => {
    const channel = channelRef.current;
    channel.postMessage({ type: 'REQUEST_SYNC' });
    channel.onmessage = (event) => {
      const { type, gameConfig, currentTeam, revealedItems } = event.data;
      if (type === 'SYNC_STATE') {
        setItems(gameConfig?.items || []);
        setTeams(gameConfig?.teams || []);
        setCurrentTeam(currentTeam || 0);
        setRevealedItems(revealedItems || []);
      }
    };
    // Only close on true unmount
    return () => {
      channel.close();
    };
  }, []);

  const handleCorrectAnswer = (itemId, teamId) => {
    if (channelRef.current) {
      channelRef.current.postMessage({ type: 'CORRECT_ANSWER', itemId, teamId });
    }
  };

  const handleWrongAnswer = (teamId) => {
    if (channelRef.current) {
      channelRef.current.postMessage({ type: 'WRONG_ANSWER', teamId });
    }
  };

  const handleRevealAll = () => {
    if (channelRef.current) {
      channelRef.current.postMessage({ type: 'REVEAL_ALL' });
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <ControlPanel
        items={items}
        onCorrectAnswer={handleCorrectAnswer}
        onWrongAnswer={handleWrongAnswer}
        onRevealAll={handleRevealAll}
        teams={teams}
        currentTeam={currentTeam}
        revealedItems={revealedItems}
      />
    </div>
  );
}

export default ControlPanelPage; 