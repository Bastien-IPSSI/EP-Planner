import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import de useNavigate
import { useUser } from "../UserContext"; // Import du contexte

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const { user, login, logout } = useUser();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

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
                login(data.user);


                if(data.user.role === "ROLE_ADMIN"){
                    navigate("/admin/chantiers");
                }else{
                    navigate("/chantiers");
                }
            } else {
                throw new Error(data.message || "Une erreur est survenue");
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="bg-light min-vh-100 min-vw-100 d-flex align-items-center justify-content-center">
            <div className="row justify-content-center w-50">
                <div className="col-md-8 col-lg-8">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title text-center mb-4">Connexion</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Email :</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Mot de passe :</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <button 
                                    type="submit" 
                                    className="btn btn-dark w-100"
                                >
                                    Se connecter
                                </button>
                            </form>

                            {error && (
                                <div className="alert alert-danger mt-3" role="alert">
                                    {error}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
