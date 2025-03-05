import React, { useEffect, useState } from 'react';

const VoirChantier = ({ employeId }) => {
  const [chantiers, setChantiers] = useState([]);
  const [loading, setLoading] = useState(true);
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
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erreur:', error);
        setError('Erreur lors de la récupération des chantiers');
        setLoading(false);
      });
  }, [employeId]);
  

  if (loading) return <div>Chargement des chantiers...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Chantiers attribués</h2>
      <ul>
        {chantiers.map((chantier) => (
          <li key={chantier.id}>
            <strong>{chantier.nom}</strong> - {chantier.lieu} <br />
            📅 {chantier.date_debut} → {chantier.date_fin} <br />
            🔵 Statut : {chantier.statut} <br />
            🔴 Affectation : {chantier.affectation_status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VoirChantier;
