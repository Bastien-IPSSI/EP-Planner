import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from '../common/Spinner';

const VoirChantier = ({ employeId }) => {
  const [chantiers, setChantiers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
  
    fetch(`http://localhost:8000/api/employe/${employeId}/chantiers`)  
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erreur réseau ou serveur: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
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
    <div className="container p-4 bg-light min-vh-100" style={{ marginTop: "7vh" }}>
      <Spinner />
    </div>
  );

  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container p-4 bg-light min-vh-100" style={{ marginTop: "7vh" }}>
      <h2 className="mb-4">📋 Chantiers attribués</h2>

      <div className="row">
        {chantiers.map((chantier) => (
          <div key={chantier.id} className="col-md-6 col-lg-4">
            <div 
              className="card shadow-sm p-3 mb-4 clickable-card"
              onClick={() => navigate(`/chantiers/${chantier.id}`)}
              style={{ cursor: 'pointer', transition: '0.3s' }}
            >
              <div className="card-body">
                <h5 className="card-title">{chantier.nom}</h5>
                
                <p className="card-text">
                  <i className="fas fa-map-marker-alt text-primary me-2"></i>
                  {chantier.lieu}
                </p>

                <p className="card-text">
                  <i className="fas fa-calendar-alt text-success me-2"></i>
                  {new Date(chantier.date_debut).toLocaleDateString()} → {new Date(chantier.date_fin).toLocaleDateString()}
                </p>

                <p className="card-text">
                  <i className="fas fa-exclamation-circle text-danger me-2"></i>
                  Affectation : {chantier.affectation_status}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VoirChantier;
