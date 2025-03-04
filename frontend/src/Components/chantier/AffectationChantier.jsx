import { useState, useEffect } from "react";

const AffectationChantier = ({ onAddAffectation, besoins }) => {
    const [employes, setEmployes] = useState([]);
    const [selectedEmploye, setSelectedEmploye] = useState("");

    useEffect(() => {
        fetch("http://localhost:8000/api/admin/employes")
            .then((response) => response.json())
            .then((data) => {
                setEmployes(data);
            })
            .catch((error) => console.error("Erreur API :", error));
    }, []);

    const handleAdd = () => {
        if (!selectedEmploye) {
            alert("Veuillez sélectionner un employé !");
            return;
        }

        const employeData = JSON.parse(selectedEmploye);
        const employeSpecialite = employeData.specialite;

        // Vérifier si la spécialité de l'employé correspond à l'un des besoins
        // TODO vérifier aussi le nombre d'employé pour chaque besoin
        const isSpecialityValid = besoins.some(besoin => besoin.speciality === employeSpecialite);

        if (!isSpecialityValid) {
            alert("L'employé ne possède pas la spécialité requise pour ce chantier.");
            return;
        }

        onAddAffectation({
            id: employeData.id,
            name: `${employeData.user_name} ${employeData.user_prenom}`,
            specialite: employeSpecialite,
        });

        setSelectedEmploye("");
    };

    return (
        <div>
            <div className="d-flex align-items-center mt-2">
                <label className="form-label me-3" htmlFor="affectation">Affectation :</label>
                <select
                    className="form-control w-25"
                    name="affectation"
                    id="affectation"
                    value={selectedEmploye}
                    onChange={(e) => setSelectedEmploye(e.target.value)}
                >
                    <option value="">-- Sélectionner --</option>
                    {employes.map((employe, index) => (
                        <option key={index} value={JSON.stringify({
                            "id": employe.id, 
                            "specialite": employe.specialite, 
                            "user_name": employe.user_name, 
                            "user_prenom": employe.user_prenom
                        })}
                        >
                            {employe.user_name} {employe.user_prenom} ({employe.specialite})
                        </option>
                    ))}
                </select>
            </div>

            <button type="button" className="btn btn-success mt-3" onClick={handleAdd}>Ajouter une affectation</button>
        </div>
    );
};

export default AffectationChantier;
