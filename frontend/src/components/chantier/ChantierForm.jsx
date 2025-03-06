import { useState } from "react";
import BesoinChantier from "./BesoinChantier";
import AffectationChantier from "./AffectationChantier";
import { useParams, useNavigate } from "react-router-dom";

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
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
    
        try {

            console.log("formData: ", formData);
            const response = await fetch("http://localhost:8000/api/admin/chantiers/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            navigate("/admin/chantiers");
        } catch (error) {
            console.error("Erreur API :", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container bg-white p-2 h-100 d-flex flex-column" style={{marginTop: "7vh"}}>
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

                <h2>Besoins :</h2>
                <BesoinChantier formData={formData} setFormData={setFormData} />


                <h2>Affecations :</h2>
                <AffectationChantier formData={formData} setFormData={setFormData} besoins={formData.besoinChantier} />
                
                <button disabled={isSubmitting} type="submit" className="btn btn-primary mt-3">
                    {isSubmitting ? "En cours..." : "Enregistrer"}
                </button>
            </form>
        </div>
    );
};

export default ChantierForm;
