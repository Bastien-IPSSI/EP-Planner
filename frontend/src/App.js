import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Login from './Pages/login';
import CustomNavbar from './Components/Nav';


const App = () => {
  return (
    <div>
      {/* Ajoute uniquement le composant Login ici */}
      <CustomNavbar />
      <Login />
    </div>
  );
};

export default App;
