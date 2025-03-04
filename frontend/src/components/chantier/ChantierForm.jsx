import { useState } from "react";
import BesoinChantier from "./BesoinChantier";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import AffectationChantier from "./AffectationChantier";

const ChantierForm = () => {
    const [formData, setFormData] = useState({
        nom: "",
        lieu: "",
        dateDebut: "",
        dateFin: "",
        statut: "En cours",
        besoinChantier: [],
        affectations: [],
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleAddBesoin = (besoin) => {
        setFormData((prevData) => ({
            ...prevData,
            besoinChantier: [...prevData.besoinChantier, besoin],
        }));
    };

    const handleRemoveBesoin = (index) => {
        setFormData((prevData) => ({
            ...prevData,
            besoinChantier: prevData.besoinChantier.filter((_, i) => i !== index),
        }));
    };

    const handleAddAffectation = (affectation) => {
        setFormData((prevData) => ({
            ...prevData,
            affectations: [...prevData.affectations, affectation],
        }));
    };

    const handleRemoveAffectation = (index) => {
        setFormData((prevData) => ({
            ...prevData,
            affectations: prevData.affectations.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Data:", formData);
        // TODO requete API submit
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
                        <div key={index} className="border p-4 m-2 d-flex justify-content-between position-relative">
                            <div className="me-2">
                                <div><strong>Spécialité :</strong> {besoin.speciality}</div>
                                <div><strong>Nombre :</strong> {besoin.number}</div>
                            </div>
                            <button
                                className="btn p-0 position-absolute top-0 end-0"
                                style={{ width: "30px", height: "30px" }}
                                onClick={() => handleRemoveBesoin(index)}
                            >
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                        </div>
                    ))}
                </div>

                <BesoinChantier onAddBesoin={handleAddBesoin} />

                <h2>Affecations :</h2>
                <div className="d-flex flex-wrap">
                    {formData.affectations.map((affectation, index) => (
                        <div key={index} className="border p-4 m-2 d-flex justify-content-between position-relative">
                            <div className="me-2">
                                <div><strong>Employe :</strong>{affectation.name} ({affectation.specialite})</div>
                            </div>
                            <button
                                className="btn p-0 position-absolute top-0 end-0"
                                style={{ width: "30px", height: "30px" }}
                                onClick={() => handleRemoveAffectation(index)}
                            >
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                        </div>
                    ))}
                </div>

                <AffectationChantier onAddAffectation={handleAddAffectation} besoins={formData.besoinChantier} />

                <button type="submit" className="btn btn-primary mt-3">Valider</button>
            </form>
        </div>
    );
};

export default ChantierForm;
