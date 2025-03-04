// src/components/Login.js

import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
    const [mail, setMail] = useState('');
    const [mdp, setMdp] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8000/login', {
                mail: mail,
                mdp: mdp
            });

            // Si la connexion est réussie, on peut rediriger ou afficher un message
            alert('Login successful!');
            console.log(response.data);

            // Ici, tu peux aussi sauvegarder le token dans localStorage ou un state global si besoin.
            document.cookie = `AUTH_TOKEN=${response.data.token}; path=/;`;

        } catch (error) {
            setErrorMessage('Invalid credentials');
            console.error(error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>Mail:</label>
                <input 
                    type="email" 
                    value={mail} 
                    onChange={(e) => setMail(e.target.value)} 
                    required
                />
                <label>Mot de passe:</label>
                <input 
                    type="password" 
                    value={mdp} 
                    onChange={(e) => setMdp(e.target.value)} 
                    required
                />
                <button type="submit">Connexion</button>
            </form>

            {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
        </div>
    );
};

export default Login;
