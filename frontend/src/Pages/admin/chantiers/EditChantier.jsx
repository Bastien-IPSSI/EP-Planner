import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BesoinChantier from "../../../Components/chantier/BesoinChantier";
import AffectationChantier from "../../../Components/chantier/AffectationChantier";
import Spinner from "../../../Components/common/Spinner";

function EditChantier() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nom: "",
        lieu: "",
        dateDebut: "",
        dateFin: "",
        statut: "En cours",
        besoinChantier: [],
        affectations: [],
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchChantierData = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`http://localhost:8000/api/admin/chantiers/${id}`);
                if (!response.ok) throw new Error('Chantier non trouvé');
                const data = await response.json();

                if(!data.besoinChantier) data.besoinChantier = [];
                if(!data.affectations) data.affectations = [];

                setFormData({
                    ...data,
                    dateDebut: data.dateDebut.split('T')[0],
                    dateFin: data.dateFin.split('T')[0]
                });
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchChantierData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await fetch(`http://localhost:8000/api/admin/chantiers/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (!response.ok) throw new Error('Erreur lors de la mise à jour');
            navigate(`/admin/chantiers/${id}`);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (error) return <div className="container p-3 text-danger">Erreur: {error}</div>;
    if (isLoading) return <Spinner />;

    return (
        <div className="container bg-white p-4 h-100 d-flex flex-column">
            <form onSubmit={handleSubmit} className="card">
                <div className="card-body">
                    <h1 className="card-title mb-4">Modifier le chantier</h1>
                    
                    <div className="row g-3 mb-4">
                        <div className="col-md-6">
                            <label className="form-label">Nom</label>
                            <input 
                                className="form-control" 
                                type="text" 
                                name="nom" 
                                value={formData.nom} 
                                onChange={handleChange} 
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Lieu</label>
                            <input 
                                className="form-control" 
                                type="text" 
                                name="lieu" 
                                value={formData.lieu} 
                                onChange={handleChange} 
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Date de début</label>
                            <input 
                                className="form-control" 
                                type="date" 
                                name="dateDebut" 
                                value={formData.dateDebut} 
                                onChange={handleChange} 
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Date de fin</label>
                            <input 
                                className="form-control" 
                                type="date" 
                                name="dateFin" 
                                value={formData.dateFin} 
                                onChange={handleChange} 
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Statut</label>
                            <select 
                                className="form-select" 
                                name="statut" 
                                value={formData.statut} 
                                onChange={handleChange}
                            >
                                <option value="En cours">En cours</option>
                                <option value="Terminé">Terminé</option>
                            </select>
                        </div>
                    </div>

                    <div className="mb-4">
                        <h2 className="h4 mb-3">Besoins</h2>
                        <BesoinChantier formData={formData} setFormData={setFormData} />
                    </div>

                    <div className="mb-4">
                        <h2 className="h4 mb-3">Affectations</h2>
                        <AffectationChantier 
                            formData={formData} 
                            setFormData={setFormData} 
                            besoins={formData.besoinChantier || []} 
                        />
                    </div>

                    <div className="text-end">
                        <button 
                            disabled={isSubmitting} 
                            type="submit" 
                            className="btn btn-primary"
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Enregistrement...
                                </>
                            ) : (
                                "Enregistrer les modifications"
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default EditChantier;
