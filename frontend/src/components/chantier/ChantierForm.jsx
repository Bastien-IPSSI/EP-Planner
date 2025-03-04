import { useState } from "react";
import BesoinChantier from "./BesoinChantier";

const ChantierForm = () => {
    const [formData, setFormData] = useState({
        nom: "",
        lieu: "",
        dateDebut: "",
        dateFin: "",
        statut: "En cours",
        besoinChantier: [],
    });

    // Gérer les changements des champs du formulaire principal
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Ajouter un besoin de chantier
    const handleAddBesoin = (besoin) => {
        setFormData((prevData) => ({
            ...prevData,
            besoinChantier: [...prevData.besoinChantier, besoin],
        }));
    };

    // Supprimer un besoin chantier
    const handleRemoveBesoin = (index) => {
        setFormData((prevData) => ({
            ...prevData,
            besoinChantier: prevData.besoinChantier.filter((_, i) => i !== index),
        }));
    };

    // Soumettre le formulaire
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Data:", formData);
        // Envoyer `formData` vers ton API via `fetch` ou `axios`
    };

    return (
        <div className="container bg-white p-2 h-100 d-flex flex-column">
            <form onSubmit={handleSubmit}>
                <h1>Chantier :</h1>

                <div className="d-flex align-items-center">
                    <label htmlFor="nom">Nom:</label>
                    <input
                        className="form-control m-2"
                        type="text"
                        name="nom"
                        id="nom"
                        value={formData.nom}
                        onChange={handleChange}
                    />

                    <label htmlFor="lieu">Lieu:</label>
                    <input
                        className="form-control m-2"
                        type="text"
                        name="lieu"
                        id="lieu"
                        value={formData.lieu}
                        onChange={handleChange}
                    />
                </div>

                <div className="d-flex align-items-center">
                    <label htmlFor="dateDebut">Du</label>
                    <input
                        className="form-control m-2"
                        type="date"
                        name="dateDebut"
                        id="dateDebut"
                        value={formData.dateDebut}
                        onChange={handleChange}
                    />

                    <label htmlFor="dateFin">Au</label>
                    <input
                        className="form-control m-2"
                        type="date"
                        name="dateFin"
                        id="dateFin"
                        value={formData.dateFin}
                        onChange={handleChange}
                    />
                </div>

                <div className="d-flex align-items-center">
                    <label htmlFor="statut">Statut</label>
                    <select
                        className="form-control m-2"
                        name="statut"
                        id="statut"
                        value={formData.statut}
                        onChange={handleChange}
                    >
                        <option value="En cours">En cours</option>
                        <option value="Terminé">Terminé</option>
                    </select>
                </div>

                <h2>Besoins du chantier :</h2>
                <div className="d-flex flex-wrap">
                    {formData.besoinChantier.map((besoin, index) => (
                        <div key={index} className="border p-2 m-2 d-flex justify-content-between">
                            <div>
                                <p><strong>Spécialité :</strong> {besoin.speciality}</p>
                                <p><strong>Nombre :</strong> {besoin.number}</p>
                            </div>
                            <button
                                className="btn btn-danger text-white text-center"
                                style={{ width: "30px", height: "30px" }}
                                onClick={() => handleRemoveBesoin(index)}
                            >
                                X
                            </button>
                        </div>
                    ))}
                </div>

                <BesoinChantier onAddBesoin={handleAddBesoin} />

                <button type="submit" className="btn btn-primary mt-3">Valider</button>
            </form>
        </div>
    );
};

export default ChantierForm;
