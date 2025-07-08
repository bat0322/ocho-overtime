import React, { useRef, useEffect, useState } from 'react';
import ControlPanel from './components/ControlPanel';

// Dummy items and team for initial render; you can improve this by syncing state from the main window if needed
const defaultItems = [];

function ControlPanelPage() {
  const channelRef = useRef(null);
  const [items, setItems] = useState([]);
  const [currentTeam, setCurrentTeam] = useState(1);
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
        setCurrentTeam(currentTeam || 1);
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

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)' }}>
      <ControlPanel
        items={items}
        onCorrectAnswer={handleCorrectAnswer}
        onWrongAnswer={handleWrongAnswer}
        currentTeam={currentTeam}
        revealedItems={revealedItems}
      />
    </div>
  );
}

export default ControlPanelPage; 