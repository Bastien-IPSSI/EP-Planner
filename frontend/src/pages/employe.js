import React, { useState } from 'react';
import VoirChantier from '../Components/chantier/voirChantier';

const Employe = () => {
  const [employeId, setEmployeId] = useState(4); 

  return (
    <div>
      <h1>Page de l'employé {employeId}</h1>
      <VoirChantier employeId={employeId} />
    </div>
  );
};

export default Employe;
