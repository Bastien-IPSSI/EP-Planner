import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Spinner from "../../../Components/common/Spinner";

function ChantierInfo() {
    const { id } = useParams();
    const [chantier, setChantier] = useState(null);
    const [besoins, setBesoins] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchChantierInfo = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/admin/chantier/${id}`);
                if (!response.ok) {
                    throw new Error('Chantier non trouvé');
                }
                const data = await response.json();
                setChantier(data);
                setIsLoading(false);
                console.log(data);
            } catch (error) {
                setError(error.message);
                setIsLoading(false);
            }
        };

        const fetchBesoins = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/admin/chantier/${id}/besoins`);
                if (!response.ok) {
                    throw new Error('Besoins non trouvés');
                }
                const data = await response.json();
                console.log(data);
                setBesoins(data);
                setIsLoading(false);
            } catch (error) {
                setError(error.message);
                setIsLoading(false);
            }
        };

        fetchChantierInfo();
        fetchBesoins();
    }, [id]);


    if (isLoading) return <Spinner />;
    if (error) return <div className="container p-3 text-danger">Erreur: {error}</div>;

    return (
        <div className="container p-4 bg-light min-vh-100">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Link to="/admin/chantiers" className="btn btn-outline-primary">
                    Retour aux chantiers
                </Link>
                <Link to={`/admin/chantiers/${id}/edit`} className="btn btn-primary">
                    Modifier le chantier
                </Link>
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