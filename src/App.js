import React, { useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import MainGame from './MainGame';
import ControlPanelPage from './ControlPanelPage';

function App() {
  useEffect(() => {
    // Set the background image globally for all pages
    document.body.style.backgroundImage = `url(${process.env.PUBLIC_URL}/ocho_background.png)`;
    document.body.style.backgroundSize = 'auto 100%';
    document.body.style.backgroundPosition = 'center center';
    document.body.style.backgroundAttachment = 'fixed';
    document.body.style.backgroundRepeat = 'repeat-x';
  }, []);

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<MainGame />} />
        <Route path="/control-panel" element={<ControlPanelPage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
