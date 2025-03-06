import React, { useState, useEffect } from 'react';
import VoirChantier from '../../../Components/chantier/voirChantier';
import { useUser } from '../../../UserContext';

const Employe = () => {
  const { user } = useUser();
  console.log(user);
  const [employeId, setEmployeId] = useState(null);

  useEffect(() => {
    if (user?.employe_id) {
      setEmployeId(user.employe_id);
    }
  }, [user]);

  if (employeId === null) {
    return <p>Chargement...</p>;
  }

  return (
    <div>
      <VoirChantier employeId={employeId} />
    </div>
  );
};

export default Employe;
