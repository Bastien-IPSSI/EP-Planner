import { useState } from "react";

function OuvrierForm() {
    const [ouvrier, setOuvrier] = useState({
        nom: '',
        prenom: '',
        mail: '',
        mdp: '',
        role: '',
        specialite: '',
        skills: []
    });

    function submit(e){
        e.preventDefault()
        postData()
        
    }
    function handleChange(e) {
        setOuvrier((prev) => ({ ...prev, [e.target.name]: e.target.value.trim() }));
        console.log(e.target.name, e.target.value);
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
        const url = "http://localhost:8000/api/admin/ouvriers";
    
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
    
            const data = await response.json();
            console.log("data: ", data);
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
                        <label htmlFor="nom" >Nom :</label>
                        <input type="text" className="form-control" name="nom" onChange={handleChange} value={ouvrier.nom} />
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="prenom" className="form-label">Prénom :</label>
                        <input type="text" className="form-control" name="prenom" onChange={handleChange} value={ouvrier.prenom} />
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-md-6">
                        <label htmlFor="mail" className="form-label">Email :</label>
                        <input type="email" className="form-control" name="mail" onChange={handleChange} value={ouvrier.mail} />
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="mdp" className="form-label">Mot de passe :</label>
                        <input type="password" className="form-control" name="mdp" onChange={handleChange} value={ouvrier.mdp} />
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-md-6">
                        <label htmlFor="role" className="form-label">Rôle :</label>
                        <select className="form-select" name="role" onChange={handleChange} value={ouvrier.role}>
                            <option value="">Sélectionner un rôle</option>
                            <option value="admin">Admin</option>
                            <option value="ouvrier">Ouvrier</option>
                        </select>
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="specialite" className="form-label">Spécialité :</label>
                        <select className="form-select" name="specialite" onChange={handleChange} value={ouvrier.specialite}>
                            <option value="">Sélectionner une spécialité</option>
                            <option value="spe1">Spé 1</option>
                            <option value="spe2">Spé 2</option>
                        </select>
                    </div>
                </div>
                <hr className="my-8" />
                <div className="mb-3">
                    <label htmlFor="skills" className="form-label">Compétences :</label>
                    {ouvrier.skills.map((skill, index) => (
                        <div key={index} className="input-group mb-2">
                            <input
                                type="text"
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
