// src/Components/VoirChantier.jsx
import React, { useEffect, useState } from 'react';

const VoirChantier = ({ employeId }) => {
  const [chantiers, setChantiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Récupération des chantiers associés à l'employé
    fetch(`/api/employe/${employeId}/chantiers`)
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          setError(data.message); // Affichage d'un message si aucun chantier n'est trouvé
        } else {
          setChantiers(data); // Mise à jour des chantiers
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erreur:', error);
        setError('Erreur lors de la récupération des chantiers');
        setLoading(false);
      });
  }, [employeId]); // Déclenche l'appel API à chaque fois que l'ID de l'employé change

  // Affichage pendant le chargement
  if (loading) {
    return <div>Chargement des chantiers...</div>;
  }

  return (
    <div>
      <h1>Chantiers de l'employé {employeId}</h1>
      {error ? (
        <p>{error}</p>
      ) : (
        <ul>
          {chantiers.map((chantier) => (
            <li key={chantier.id}>
              <strong>{chantier.nom}</strong>
              <p>{chantier.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default VoirChantier;
