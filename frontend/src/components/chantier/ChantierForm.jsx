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

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
    
        try {
            const response = await fetch("http://localhost:8000/api/admin/chantier/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            const data = await response.json();
            setPopupMessage("Chantier enregistré avec succès!");
            setShowPopup(true);
            setFormData({
                nom: "",
                lieu: "",
                dateDebut: "",
                dateFin: "",
                statut: "En cours",
                besoinChantier: [],
                affectations: [],
            });
        } catch (error) {
            console.error("Erreur API :", error);
            setPopupMessage("Une erreur est survenue lors de l'enregistrement du chantier.");
            setShowPopup(true);
        } finally {
            setIsSubmitting(false);
        }
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
                                type="button"
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
                                type="button"
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

                <button disabled={isSubmitting} type="submit" className="btn btn-primary mt-3">
                    {isSubmitting ? "En cours..." : "Enregistrer"}
                </button>
            </form>
            {showPopup && (
                <div className="modal fade show d-block" tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Notification</h5>
                                <button type="button" className="btn-close" onClick={() => setShowPopup(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p>{popupMessage}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChantierForm;
