import { useState, useEffect } from "react";
import Spinner from "../common/Spinner";

const BesoinChantier = ({ formData, setFormData }) => {
    const [specialites, setSpecialites] = useState([]);
    const [newBesoin, setNewBesoin] = useState({ specialite: "", nombre: 1 });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        fetch("http://localhost:8000/api/specialities")
            .then((response) => response.json())
            .then((data) => setSpecialites(data))
            .catch((error) => console.error("Erreur API :", error))
            .finally(() => setIsLoading(false));
    }, []);

    const handleNewBesoinChange = (e) => {
        const { name, value } = e.target;
        setNewBesoin(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const addBesoin = () => {
        if (newBesoin.specialite && newBesoin.nombre > 0) {
            setFormData(prev => ({
                ...prev,
                besoinChantier: [...prev.besoinChantier, newBesoin]
            }));
            setNewBesoin({ specialite: "", nombre: 1 }); // Reset form after adding
        }
    };

    const removeBesoin = (index) => {
        setFormData(prev => ({
            ...prev,
            besoinChantier: prev.besoinChantier.filter((_, i) => i !== index)
        }))
    };

    if (isLoading) return <Spinner />;

    return (
        <div className="card p-3">
            <div className="mb-4">
                <h5 className="card-title">Ajouter un besoin</h5>
                <div className="row g-3 align-items-end">
                    <div className="col-md-5">
                        <label className="form-label">Spécialité</label>
                        <select
                            className="form-select"
                            name="specialite"
                            value={newBesoin.specialite}
                            onChange={handleNewBesoinChange}
                        >
                            <option value="">Sélectionnez une spécialité</option>
                            {specialites.map((specialite, index) => (
                                <option key={index} value={specialite}>
                                    {specialite}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Nombre</label>
                        <input
                            type="number"
                            className="form-control"
                            name="nombre"
                            min="1"
                            value={newBesoin.nombre}
                            onChange={handleNewBesoinChange}
                        />
                    </div>
                    <div className="col-md-3">
                        <button
                            type="button"
                            className="btn btn-primary w-100"
                            onClick={addBesoin}
                        >
                            Ajouter
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-4">
                <h5 className="card-title">Besoins actuels</h5>
                {formData.besoinChantier?.length > 0 ? (
                    <div className="row g-3">
                        {formData.besoinChantier.map((besoin, index) => (
                            <div key={index} className="col-md-6">
                                <div className="card">
                                    <div className="card-body d-flex justify-content-between align-items-center">
                                        <span>{besoin.specialite}: {besoin.nombre}</span>
                                        <button
                                            type="button"
                                            className="btn btn-danger btn-sm"
                                            onClick={() => removeBesoin(index)}
                                        >
                                            Supprimer
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted">Aucun besoin renseigné</p>
                )}
            </div>
        </div>
    );
};

export default BesoinChantier;
