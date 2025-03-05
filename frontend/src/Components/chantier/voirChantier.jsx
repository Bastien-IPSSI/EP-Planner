import React, { useEffect, useState } from 'react';

const VoirChantier = ({ employeId }) => {
  const [chantiers, setChantiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log(`Fetching chantiers for employeId: ${employeId}`);

    // Appel à l'API pour récupérer les chantiers de l'employé
    fetch(`/api/employe/${employeId}/chantiers`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erreur réseau ou serveur');
        }
        return response.json();
      })
      .then((data) => {
        console.log('API Response:', data);
        if (data.message) {
          setError(data.message); // Affichage du message d'erreur
        } else {
          setChantiers(data); // Mise à jour des chantiers
        }
        setLoading(false); // Arrêt du chargement
      })
      .catch((error) => {
        console.error('Erreur:', error);
        setError('Erreur lors de la récupération des chantiers');
        setLoading(false);
      });
  }, [employeId]);

  // Affichage pendant le chargement ou en cas d'erreur
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
            🔵 Statut : {chantier.statut}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VoirChantier;
