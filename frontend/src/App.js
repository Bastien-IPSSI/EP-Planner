import React, { useEffect, useState } from 'react';

const App = () => {
  const [controllerName, setControllerName] = useState('');

  useEffect(() => {
    fetch('http://localhost:8000/api/controller-name')
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setControllerName(data.controller_name);
      })
      .catch((error) => {
        console.log("error");
        console.error('Erreur lors de la récupération du nom du contrôleur:', error);
      });
  }, []);
  

  return (
    <div>
      <h1>Nom du contrôleur : {controllerName}</h1>
    </div>
  );
};

export default App;
