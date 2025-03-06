import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../common/Spinner";

const VoirChantier = ({ employeId }) => {
  const [chantiers, setChantiers] = useState([]);
  const [filteredChantiers, setFilteredChantiers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(""); // Filtre par statut
  const navigate = useNavigate();

  useEffect(() => {
    console.log(`Fetching chantiers for employeId: ${employeId}`);

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
          setFilteredChantiers(data); // Par défaut, afficher tout
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Erreur:", error);
        setError("Erreur lors de la récupération des chantiers");
        setIsLoading(false);
      });
  }, [employeId]);

  const handleFilterChange = (event) => {
    const status = event.target.value;
    setSelectedStatus(status);
    
    if (status === "") {
      setFilteredChantiers(chantiers);
    } else {
      setFilteredChantiers(chantiers.filter((chantier) => chantier.affectation_status === status));
    }
  };

  if (isLoading)
    return (
      <div className="container p-4 bg-light min-vh-100" style={{ marginTop: "7vh" }}>
        <Spinner />
      </div>
    );

  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container p-4 bg-light min-vh-100" style={{ marginTop: "7vh" }}>
      <h2 className="mb-4">
        <i className="fas fa-city me-2"></i>Chantiers attribués
      </h2>

      <div className="mb-4">
        <label className="form-label fw-bold">Filtrer par statut :</label>
        <select className="form-select w-50" value={selectedStatus} onChange={handleFilterChange}>
          <option value="">Tous les statuts</option>
          <option value="En cours">En cours</option>
          <option value="Termine">Terminé</option>
        </select>
      </div>

      <div className="row">
        {filteredChantiers.length > 0 ? (
          filteredChantiers.map((chantier) => (
            <div key={chantier.id} className="col-md-6 col-lg-4">
              <div
                className="card shadow-sm p-3 mb-4 clickable-card"
                onClick={() => navigate(`/chantiers/${chantier.id}`)}
                style={{ cursor: "pointer", transition: "0.3s" }}
              >
                <div className="card-body">
                  <h5 className="card-title">{chantier.nom}</h5>

                  <p className="card-text">
                    <i className="fas fa-map-marker-alt text-primary me-2"></i>
                    {chantier.lieu}
                  </p>

                  <p className="card-text">
                    <i className="fas fa-calendar-alt text-success me-2"></i>
                    {new Date(chantier.date_debut).toLocaleDateString()} →{" "}
                    {new Date(chantier.date_fin).toLocaleDateString()}
                  </p>

                  <p className="card-text">
                    <i className="fas fa-exclamation-circle text-danger me-2"></i>
                    Affectation : {chantier.affectation_status}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted">Aucun chantier correspondant au filtre sélectionné.</p>
        )}
      </div>
    </div>
  );
};

export default VoirChantier;
