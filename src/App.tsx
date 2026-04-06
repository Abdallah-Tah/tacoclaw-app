import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Overview } from './pages/Overview';
import { BotDetail } from './pages/BotDetail';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/bot/:botId" element={<BotDetail />} />
        <Route path="/faces" element={<div className="min-h-screen bg-slate-950 text-white p-8">Face Manager coming soon...</div>} />
        <Route path="*" element={<Overview />} />
      </Routes>
    </Router>
  );
};

export default App;
