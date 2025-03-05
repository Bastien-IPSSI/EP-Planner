import React, { useEffect, useState } from 'react';

const VoirChantier = ({ employeId }) => {
  const [chantiers, setChantiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/employe/${employeId}/chantiers`)
      .then(response => response.json())
      .then(data => {
        if (data.message) {
          setError(data.message);
        } else {
          setChantiers(data);
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Erreur lors de la récupération des chantiers');
        setLoading(false);
      });
  }, [employeId]);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Chantiers assignés</h2>
      <ul>
        {chantiers.map(chantier => (
          <li key={chantier.id}>
            <strong>{chantier.nom}</strong>
            <p>Lieu: {chantier.lieu}</p>
            <p>Début: {chantier.date_debut}</p>
            <p>Fin: {chantier.date_fin}</p>
            <p>Statut: {chantier.statut}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VoirChantier;
