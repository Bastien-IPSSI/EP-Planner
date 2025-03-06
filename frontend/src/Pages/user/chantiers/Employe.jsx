import React, { useState } from 'react';
import VoirChantier from '../../../Components/chantier/voirChantier';
import { useUser } from '../../../UserContext';

const Employe = () => {
  const { user } = useUser();
  const [employeId] = useState(user.employe_id);

  return (
    <div>
      <VoirChantier employeId={employeId} />
    </div>
  );
};

export default Employe;