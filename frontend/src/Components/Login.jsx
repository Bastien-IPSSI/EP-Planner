import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import de useNavigate
import { useUser } from "../UserContext"; // Import du contexte

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [message, setMessage] = useState("");
    const { user, login, logout } = useUser(); // Accéder au user et aux fonctions de login et logout
    const navigate = useNavigate(); // Redirection après connexion

    const handleLogout = async () => {
        await logout();
        navigate("/"); // Redirection vers la page d'accueil après déconnexion
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setMessage("");

        try {
            const response = await fetch("http://localhost:8000/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                login(data.user); // Utiliser la fonction de login du contexte pour stocker l'utilisateur
                navigate("/chantier"); // Redirection après connexion réussie
            } else {
                throw new Error(data.message || "Une erreur est survenue");
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <h2>Connexion</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email :</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Mot de passe :</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Se connecter</button>
            </form>

            {error && <p style={{ color: "red" }}>{error}</p>}
            {message && <p style={{ color: "green" }}>{message}</p>}

            {user && (
                <div>
                    <p>Bienvenue, {user.nom} {user.prenom}</p>
                    <button onClick={handleLogout}>Se déconnecter</button>
                </div>
            )}
        </div>
    );
};

export default Login;
