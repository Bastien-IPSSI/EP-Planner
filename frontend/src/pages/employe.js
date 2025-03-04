// src/pages/Employe.js
import React, { useState } from 'react';
import VoirChantier from '../Components/chantier/voirChantier';// Importer le composant VoirChantier

const Employe = () => {
  const [employeId, setEmployeId] = useState(1); // Vous pouvez définir l'ID de l'employé ici ou obtenir dynamiquement

  return (
    <div>
      <h1>Page de l'employé {employeId}</h1>
      <VoirChantier employeId={employeId} /> {/* Affiche les chantiers de l'employé */}
    </div>
  );
};

export default Employe;
