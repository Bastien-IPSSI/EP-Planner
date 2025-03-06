import React, { useEffect, useState } from 'react';
import Spinner from '../common/Spinner';

const VoirChantier = ({ employeId }) => {
  const [chantiers, setChantiers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log(`Fetching chantiers for employeId: ${employeId}`);
  
    fetch(`http://localhost:8000/api/employe/${employeId}/chantiers`)  
      .then((response) => {
        console.log('Response:', response);
        if (!response.ok) {
          throw new Error(`Erreur réseau ou serveur: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('API Response:', data);
        if (data.message) {
          setError(data.message);
        } else {
          setChantiers(data);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Erreur:', error);
        setError('Erreur lors de la récupération des chantiers');
        setIsLoading(false);
      });
  }, [employeId]);
  

  if (isLoading) return (
    <div className="container p-4 bg-light min-vh-100" style={{marginTop: "7vh"}}>
        <Spinner />
    </div>
);
  if (error) return <div>{error}</div>;

  return (
    <div className="container p-4 bg-light min-vh-100" style={{marginTop: "7vh"}}>
      <h2>Chantiers attribués</h2>
      <ul>
        {chantiers.map((chantier) => (
          <li key={chantier.id} onClick={() => window.location.href = `/chantiers/${chantier.id}`}>
            <strong>{chantier.nom}</strong> - {chantier.lieu} <br />
            📅 {chantier.date_debut} → {chantier.date_fin} <br />
            🔴 Affectation : {chantier.affectation_status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VoirChantier;