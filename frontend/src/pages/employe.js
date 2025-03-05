import React, { useState } from 'react';
import VoirChantier from '../Components/chantier/voirChantier'; // Importer le composant VoirChantier

const Employe = () => {
  const [employeId] = useState(4); // Définir l'ID de l'employé (peut être dynamique)

  return (
    <div>
      <h1>Page de l'employé {employeId}</h1>
      <VoirChantier employeId={employeId} /> {/* Affiche les chantiers de l'employé */}
    </div>
  );
};

export default Employe;
