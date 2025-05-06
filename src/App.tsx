
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Messages from './pages/Messages';
import SecureMessaging from './components/messaging/SecureMessaging';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SecureMessaging />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
