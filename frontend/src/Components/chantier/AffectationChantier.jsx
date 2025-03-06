import { useState, useEffect } from "react";
import Spinner from "../common/Spinner";

const AffectationChantier = ({ formData, setFormData, besoins }) => {
    const [employes, setEmployes] = useState([]);
    const [selectedEmploye, setSelectedEmploye] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        fetch("http://localhost:8000/api/admin/employes")
            .then((response) => response.json())
            .then((data) => setEmployes(data))
            .catch((error) => console.error("Erreur API :", error))
            .finally(() => setIsLoading(false));
    }, []);

    const handleAdd = () => {  
        if (!selectedEmploye) {
            alert("Veuillez sélectionner un employé !");
            return;
        }

        const employeData = JSON.parse(selectedEmploye);
        const employeSpecialite = employeData.specialite;

        const isSpecialityValid = besoins.some(besoin => besoin.specialite === employeSpecialite);

        if (!isSpecialityValid) {
            alert("L'employé ne possède pas la spécialité requise pour ce chantier.");
            return;
        }

        const newAffectation = {
            id: employeData.id,
            employe: `${employeData.nom} ${employeData.prenom}`,
            specialite: employeSpecialite,
        };

        setFormData(prev => ({
            ...prev,
            affectations: [...prev.affectations, newAffectation]
        }));

        setSelectedEmploye("");
    };

    const handleRemoveAffectation = (index) => {
        setFormData(prev => ({
            ...prev,
            affectations: prev.affectations.filter((_, i) => i !== index)
        }));
    };

    if (isLoading) return <Spinner />;

    return (
        <div className="card p-3">
            <div className="mb-4">
                <h5 className="card-title">Ajouter une affectation</h5>
                <div className="row g-3 align-items-end">
                    <div className="col-md-9">
                        <label className="form-label">Sélectionner un employé</label>
                        <select
                            className="form-select"
                            name="affectation"
                            value={selectedEmploye}
                            onChange={(e) => setSelectedEmploye(e.target.value)}
                        >
                            <option value="">-- Sélectionner --</option>
                            {employes.map((employe, index) => (
                                <option key={index} value={JSON.stringify({
                                    "id": employe.id, 
                                    "specialite": employe.specialite, 
                                    "nom": employe.nom, 
                                    "prenom": employe.prenom
                                })}
                                >
                                    {employe.nom} {employe.prenom} ({employe.specialite})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-3">
                        <button 
                            type="button" 
                            className="btn btn-dark w-100"
                            onClick={handleAdd}
                        >
                            Ajouter
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-4">
                <h5 className="card-title">Affectations actuelles</h5>
                {formData.affectations.filter((affectation) => affectation.statut !== "Termine").length > 0 ? (
                    <div className="row g-3">
                        {formData.affectations
                            .filter((affectation) => affectation.statut !== "Termine")
                            .map((affectation, index) => (
                                <div key={index} className="col-md-6">
                                    <div className="card">
                                        <div className="card-body d-flex justify-content-between align-items-center">
                                            <div>
                                                <strong>{affectation.employe}</strong>
                                                <br />
                                                <small className="text-muted">{affectation.specialite}</small>
                                            </div>
                                            <button
                                                type="button"
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleRemoveAffectation(index)}
                                            >
                                                Supprimer
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                ) : (
                    <p className="text-muted">Aucune affectation renseignée</p>
                )}
            </div>
        </div>
    );
};

export default AffectationChantier;
