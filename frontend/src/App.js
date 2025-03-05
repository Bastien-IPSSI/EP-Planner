
import React from 'react';
import Chantier from './pages/chantier';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Employe from './pages/employe';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/employe" element={<Employe />} />
        <Route path="/chantier" element={<Chantier/>}/>
      </Routes>
    </Router>
    
  );
};

export default App;
