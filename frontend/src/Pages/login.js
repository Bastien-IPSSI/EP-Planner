import React, { useState } from 'react';

const Login = () => {
  const [mail, setMail] = useState('');
  const [mdp, setMdp] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
    
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mail, mdp }),
        credentials: 'include'  
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      alert('Connexion réussie !');
      window.location.href = '/dashboard'; 
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input
          type="email"
          value={mail}
          onChange={(e) => setMail(e.target.value)}
          required
        />
        <br />
        <label>Mot de passe:</label>
        <input
          type="password"
          value={mdp}
          onChange={(e) => setMdp(e.target.value)}
          required
        />
        <br />
        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
};

export default Login;
