import { useState } from "react";

function OuvrierForm() {
    const [ouvrier, setOuvrier] = useState({
        nom: '',
        prenom: '',
        mail: '',
        password: '',
        role: '',
        specialite: '',
        skills: []
    });

    const [error, setError] = useState(false)

    function test(e){
        // Faire la requete a l'API symfony
        e.preventDefault()
        console.log("Ouvrier", ouvrier);
        
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

    return (
        <>
        <div className="container">
            <h1>Employé</h1>
            <div className="form-container">
                <form>
                    <div className="first">
                        <label htmlFor="nom">Nom:</label>
                        <input name="nom" onChange={handleChange} value={ouvrier.nom} />

                        <label htmlFor="prenom">Prénom:</label>
                        <input name="prenom" onChange={handleChange} value={ouvrier.prenom} />
                    </div>

                    <div className="second">
                        <label htmlFor="mail">Mail:</label>
                        <input name="mail" onChange={handleChange} value={ouvrier.mail} />

                        <label htmlFor="password">Mot de passe par défaut:</label>
                        <input name="password" onChange={handleChange} value={ouvrier.password} />
                    </div>

                    <div className="third">
                        <label htmlFor="role">Rôle:</label>
                        <input name="role" onChange={handleChange} value={ouvrier.role} />

                        <label htmlFor="specialite">Spécialité:</label>
                        <select  name="specialite" onChange={handleChange} value={ouvrier.specialite} >
                            {/* recupérer les options via une requete et faire un map ici */}
                            <option value="someOption">spé 1</option>
                            <option value="otherOption">spé 2</option>
                        </select>
                    </div>

                    <div className="skills">
                        <label htmlFor="skills">Compétences:</label>
                        {ouvrier.skills.map((skill, index) => (
                            <div key={index} className="skill-input">
                                <input
                                    name={`skill-${index}`}
                                    value={skill}
                                    onChange={(e) => handleSkillChange(e, index)}
                                />
                            </div>
                        ))}
                        <button type="button" onClick={addSkill}>+</button>
                    </div>

                    <button type="submit" onClick={test}>Créer</button>
                </form>
            </div>
        </div>
        </>
    );
}

export default OuvrierForm;
