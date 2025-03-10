import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Spinner from "../../../Components/common/Spinner";

function Chantiers() {
    const [chantiers, setChantiers] = useState([]);
    const [filteredChantiers, setFilteredChantiers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState(""); // Filtre par statut

    useEffect(() => {
        const fetchChantiers = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/admin/chantiers');
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des chantiers');
                }
                const data = await response.json();
                setChantiers(data);
                setFilteredChantiers(data);
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
            }
        };

        fetchChantiers();
    }, []);

    const handleFilterChange = (event) => {
        const status = event.target.value;
        setSelectedStatus(status);

        if (status === "") {
            setFilteredChantiers(chantiers);
        } else {
            setFilteredChantiers(chantiers.filter((chantier) => chantier.statut === status));
        }
    };

    if (isLoading) return (
        <div className="container p-4 bg-light d-flex justify-content-center align-items-center" style={{marginTop: "9vh", minHeight: "91vh"}}>
            <Spinner />
        </div>
    );

    return (
        <div className="container p-4 bg-light" style={{marginTop: "9vh", minHeight: "91vh"}}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="mb-0">Liste des chantiers</h1>

                <Link to="/admin/chantiers/new" className="btn btn-dark">
                    <i className="fas fa-plus me-2"></i>Nouveau chantier
                </Link>
            </div>

            <div className="mb-4">
                <label className="form-label fw-bold">Filtrer par statut :</label>
                <select className="form-select w-auto" value={selectedStatus} onChange={handleFilterChange}>
                    <option value="">Tous les statuts</option>
                    <option value="En cours">En cours</option>
                    <option value="Termine">Terminé</option>
                </select>
            </div>

            <div className="row g-4">
                {filteredChantiers.map((chantier) => (
                    <div key={chantier.id} className="col-md-6 col-lg-4">
                        <Link to={`/chantiers/${chantier.id}`} className="text-decoration-none">
                            <div className="card h-100 shadow-sm hover-shadow transition">
                                <div className="card-body">
                                    <h5 className="card-title text-grey fw-bold mb-3">{chantier.nom}</h5>
                                    <div className="mb-2">
                                        <i className="fas fa-map-marker-alt me-2 text-secondary"></i>
                                        {chantier.lieu}
                                    </div>
                                    <div className="mb-2">
                                        <i className="fas fa-calendar me-2 text-secondary"></i>
                                        {new Date(chantier.dateDebut).toLocaleDateString()} - {new Date(chantier.dateFin).toLocaleDateString()}
                                    </div>
                                    <div>
                                        <span className={`badge ${
                                            chantier.statut === 'En cours' ? 'bg-success' :
                                            chantier.statut === 'Termine' ? 'bg-danger' :
                                            'bg-secondary'
                                        }`}>
                                            {chantier.statut}
                                        </span>
                                    </div>
                                </div>
                                <div className="card-footer bg-transparent border-top-0 text-end">
                                    <small className="text-muted">Cliquez pour plus de détails</small>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
                
                {filteredChantiers.length === 0 && (
                    <div className="col-12 text-center py-5">
                        <p className="text-muted">Aucun chantier trouvé</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Chantiers;
