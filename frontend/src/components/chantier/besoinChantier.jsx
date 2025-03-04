import { useState, useEffect } from "react";

const BesoinChantier = ({ onAddBesoin }) => {
    const [specialities, setSpecialities] = useState([]);
    const [selectedSpeciality, setSelectedSpeciality] = useState("");
    const [number, setNumber] = useState("");

    useEffect(() => {
        fetch("http://localhost:8000/api/specialities")
            .then((response) => response.json())
            .then((data) => setSpecialities(data))
            .catch((error) => console.error("Erreur API :", error));
    }, []);

    const handleAdd = () => {
        if (!selectedSpeciality || !number) {
            alert("Veuillez sélectionner une spécialité et un nombre !");
            return;
        }

        // Envoyer les valeurs au formulaire parent
        onAddBesoin({ speciality: selectedSpeciality, number });

        setSelectedSpeciality("");
        setNumber("");
    };

    return (
        <div>
            <div className="d-flex align-items-center mt-2">
                <label className="form-label me-3" htmlFor="speciality">Spécialité :</label>
                <select
                    className="form-control w-25"
                    name="speciality"
                    id="speciality"
                    value={selectedSpeciality}
                    onChange={(e) => setSelectedSpeciality(e.target.value)}
                >
                    <option value="">-- Sélectionner --</option>
                    {specialities.map((speciality, index) => (
                        <option key={index} value={speciality.id}>{speciality}</option>
                    ))}
                </select>
            </div>

            <div className="d-flex align-items-center mt-2">
                <label className="form-label me-3" htmlFor="number">Nombre d'employés :</label>
                <input
                    className="form-control w-25"
                    type="number"
                    name="number"
                    id="number"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                />
            </div>

            <button type="button" className="btn btn-success mt-3" onClick={handleAdd}>Ajouter un besoin</button>
        </div>
    );
};

export default BesoinChantier;
