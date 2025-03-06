import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Spinner from "../../../Components/common/Spinner";
import { useUser } from '../../../UserContext';

function ChantierInfo() {
    const { id } = useParams();
    const [chantier, setChantier] = useState(null);
    const [besoins, setBesoins] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useUser();

    useEffect(() => {
        const fetchChantierInfo = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/admin/chantiers/${id}`);
                if (!response.ok) {
                    throw new Error('Chantier non trouvé');
                }
                const data = await response.json();
                setChantier(data);
                setIsLoading(false);
            } catch (error) {
                setError(error.message);
                setIsLoading(false);
            }
        };

        const fetchBesoins = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/admin/chantiers/${id}/besoins`);
                if (!response.ok) {
                    throw new Error('Besoins non trouvés');
                }
                const data = await response.json();
                setBesoins(data);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchChantierInfo();
        fetchBesoins();
    }, [id]);


    if (isLoading) return (
        <div className="container p-4 bg-light" style={{marginTop: "9vh", minHeight: "91vh"}}>
            <Spinner />
        </div>
    );

    if (error) return <div className="container p-3 text-danger">Erreur: {error}</div>;

    return (
        <div className="container p-4 bg-light" style={{marginTop: "9vh", minHeight: "91vh"}}>
            <div 
                className="d-flex align-items-center mb-4" 
                style={{ justifyContent: user.role === "ROLE_ADMIN" ? "space-between" : "flex-start" }}
            >

            {user.role === "ROLE_ADMIN" ? (
                <>
                    <Link to="/admin/chantiers" className="btn btn-outline-dark">
                        Retour aux chantiers
                    </Link>
                    <Link to={`/admin/chantiers/${id}/edit`} className="btn btn-dark">
                        Modifier le chantier
                    </Link>
                </>
            ) : (
                <Link to="/chantiers" className="btn btn-outline-primary">
                    Retour à mes chantiers
                </Link>
            )}

            </div>
            
            <div className="card shadow-sm">
                <div className="card-header bg-grey">
                    <h2 className="mb-0">{chantier.nom}</h2>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6">
                            <h4 className="text-secondary">Informations générales</h4>
                            <dl className="row">
                                <dt className="col-sm-4">Lieu</dt>
                                <dd className="col-sm-8">{chantier.lieu}</dd>
                                
                                <dt className="col-sm-4">Date de début</dt>
                                <dd className="col-sm-8">{new Date(chantier.dateDebut).toLocaleDateString()}</dd>
                                
                                <dt className="col-sm-4">Date de fin</dt>
                                <dd className="col-sm-8">{new Date(chantier.dateFin).toLocaleDateString()}</dd>
                                
                                <dt className="col-sm-4">Statut</dt>
                                <dd className="col-sm-8">
                                    <span className={`badge ${
                                        chantier.statut === 'En cours' ? 'bg-success' :
                                        chantier.statut === 'Termine' ? 'bg-warning' :
                                        'bg-secondary'
                                    }`}>
                                        {chantier.statut}
                                    </span>
                                </dd>
                            </dl>
                        </div>
                        <div className="col-md-6">
                            <h4 className="text-secondary">Besoins du chantier restant :</h4>
                            {
                                besoins && besoins.length > 0 ? (
                                    <ul>
                                        {besoins.map((besoin, index) => (
                                            <li className="list-group-item" key={index}>
                                                {besoin.specialite}: {besoin.nombre}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>Aucun besoin renseigné pour ce chantier.</p>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>

            <div className="card mt-4 shadow-sm">
                <div className="card-header">
                    <h4 className="mb-0">Équipes assignées</h4>
                </div>
                <div className="card-body">
                    {chantier.affectations && chantier.affectations.length > 0 ? (
                        <div className="row">
                            {chantier.affectations.map((affectation, index) => (
                                <div className="col-md-4 mb-3" key={index}>
                                    <div className="card shadow-sm">
                                        <div className="card-header">
                                            <h5 className="mb-0">{affectation.employe}</h5>
                                        </div>
                                        <div className="card-body">
                                            <p className="card-text">Specialité: {affectation.specialite}</p>
                                            <p className="card-text">Statut: {affectation.statut}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted">Aucune équipe assignée à ce chantier</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ChantierInfo;