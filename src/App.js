import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainGame from './MainGame';
import ControlPanelPage from './ControlPanelPage';

function App() {
  return (
    <BrowserRouter basename="/ocho-overtime">
      <Routes>
        <Route path="/" element={<MainGame />} />
        <Route path="/control-panel" element={<ControlPanelPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
