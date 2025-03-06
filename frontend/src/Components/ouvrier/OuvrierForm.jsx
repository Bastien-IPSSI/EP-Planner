import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function OuvrierForm() {
  const [specialities, setSpecialities] = useState([]);
  const navigate = useNavigate()

    const [ouvrier, setOuvrier] = useState({
        nom: '',
        prenom: '',
        mail: '',
        mdp: '',
        role: '',
        specialite: '',
        skills: []
    });

    useEffect(() => {
        fetch("http://localhost:8000/api/specialities")
        .then((response) => response.json())
        .then((data) => setSpecialities(data))
        .catch((error) => console.error("Erreur API :", error));
    
      }, []);
    function submit(e){
        if (!ouvrier.nom || !ouvrier.prenom || !ouvrier.mail || !ouvrier.mdp || !ouvrier.role) {
            alert("Veuillez remplir tous les champs obligatoires: Prenom, Nom, Mail, Mot de passe et role");
            return;
        }
        e.preventDefault()
        postData()
        
    }
    function handleChange(e) {
        setOuvrier((prev) => ({ ...prev, [e.target.name]: e.target.value.trim() }));
    }

    function addSkill() {
        setOuvrier((prev) => ({
            ...prev,
            skills: [...prev.skills, ""],
        }));
    }

    function handleSkillChange(e, index) {
        const updatedSkills = [...ouvrier.skills];
        updatedSkills[index] = e.target.value;
        setOuvrier((prev) => ({
            ...prev,
            skills: updatedSkills
        }));
    }

    async function postData() {
        const url = "http://localhost:8000/api/admin/employes/create";        
        try {
            const response = await fetch(url, {
                method: "POST",
                mode: "cors",
                cache: "no-cache",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(ouvrier),
            });
    
            if (!response.ok) {
                throw new Error(`Erreur HTTP ${response.status}`);
            }
    
            await response.json();
            navigate("/admin/ouvriers")
        } catch (error) {
            
            console.error("Erreur:", error);
        }
    }

    return (
        <div className="container mt-5">
        <h2 className="text-center mb-4">Créer un nouvel employé</h2>

        <div className="card shadow p-4">
            <form>
                <div className="row mb-3">
                    <div className="col-md-6">
                        <label htmlFor="nom" className="form-label" >Nom :</label>
                        <input type="text" id="nom" required className="form-control" name="nom" onChange={handleChange} value={ouvrier.nom}/>
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="prenom" className="form-label">Prénom :</label>
                        <input type="text" id="prenom" required className="form-control" name="prenom" onChange={handleChange} value={ouvrier.prenom} />
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-md-6">
                        <label htmlFor="mail" className="form-label">Email :</label>
                        <input type="email" id="mail" required className="form-control" name="mail" onChange={handleChange} value={ouvrier.mail} />
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="mdp" className="form-label">Mot de passe :</label>
                        <input type="password" id="mdp" required className="form-control" name="mdp" onChange={handleChange} value={ouvrier.mdp} />
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-md-6">
                        <label htmlFor="role" className="form-label">Rôle :</label>
                        <select className="form-select" id="role" name="role" required onChange={handleChange} value={ouvrier.role}>
                            <option value="">Sélectionner un rôle</option>
                            <option value="ROLE_ADMIN">Admin</option>
                            <option value="ROLE_USER">Ouvrier</option>
                        </select>
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="specialite" className="form-label">Spécialité :</label>
                        <select className="form-select" id="specialite" name="specialite" onChange={handleChange} value={ouvrier.specialite}>
                        {specialities.map((specialite, index) => (
                            <option key={index} value={specialite.id}>{specialite}</option>
                        ))}
                        </select>
                    </div>
                </div>
                <hr className="my-8" />
                <div className="mb-3">
                    {ouvrier.skills.map((skill, index) => (
                        <div key={index} className="input-group mb-2">
                            <label htmlFor="skills" className="form-label mx-2">Compétences :</label>
                            <input
                                type="text"
                                id="skills"
                                className="form-control"
                                value={skill}
                                onChange={(e) => handleSkillChange(e, index)}
                            />
                        </div>
                    ))}
                    <button type="button" className="btn btn-outline-primary" onClick={addSkill}>
                        Ajouter une compétence
                    </button>
                </div>

                <button className="btn btn-success" type="submit" onClick={submit}>
                    Créer l'ouvrier
                </button>
            </form>
        </div>
    </div>
    );
}

export default OuvrierForm;
