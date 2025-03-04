import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import Chantier from './pages/chantier';
import Employe from './pages/employe';

const App = () => {

  return (
    <div>
      <Chantier />
      <Employe/>
    </div>
  );
};

export default App;
