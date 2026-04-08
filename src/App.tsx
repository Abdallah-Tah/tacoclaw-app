import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Overview } from './pages/Overview';
import { BotDetail } from './pages/BotDetail';
import { FaceManager } from './pages/FaceManager';
import { NotificationContainer } from './components/shared/NotificationContainer';

const App: React.FC = () => {
  return (
    <Router>
      <NotificationContainer />
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/bot/:botId" element={<BotDetail />} />
        <Route path="/faces" element={<FaceManager />} />
        <Route path="*" element={<Overview />} />
      </Routes>
    </Router>
  );
};

export default App;