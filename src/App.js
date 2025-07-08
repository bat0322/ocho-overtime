import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import MainGame from './MainGame';
import ControlPanelPage from './ControlPanelPage';

function App() {
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
