import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';

const CustomNavbar = () => {
  // États pour gérer les informations utilisateur et l'authentification
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('user');

  useEffect(() => {
    // Exemple d'appel API pour récupérer les informations utilisateur
    fetch('/api/user', { 
      method: 'GET', 
      credentials: 'include' // Assurez-vous d'inclure les cookies ou le token d'authentification
    })
      .then(response => response.json())
      .then(data => {
        if (data.isAuthenticated) {
          setIsLoggedIn(true); // L'utilisateur est connecté
          setUsername(data.name); // Nom de l'utilisateur récupéré
          setIsAdmin(data.role === 'Admin'); // Détermine si l'utilisateur est admin
        } else {
          setIsLoggedIn(false);
        }
      })
      .catch(err => {
        console.error('Erreur lors de la récupération des données utilisateur:', err);
        setIsLoggedIn(false); // Si l'appel échoue, on considère que l'utilisateur n'est pas connecté
      });
  }, []);

  return (
    <Navbar bg="light" expand="lg" className="px-3">
      <Container className="d-flex flex-column align-items-center">
        <Nav className="w-100 d-flex justify-content-center">
          {/* Affiche le lien "Gérer les chantiers" uniquement si l'utilisateur est admin */}
          {isAdmin && <Nav.Link href="#" className="mx-3">Gérer les chantiers</Nav.Link>} 
          
          <Nav.Link href="#" className="mx-3">Mon planning</Nav.Link>
          
          {/* Affiche le lien "Gérer les ouvriers" uniquement si l'utilisateur est admin */}
          {isAdmin && <Nav.Link href="#" className="mx-3">Gérer les ouvriers</Nav.Link>} 
          
          {/* Affiche le lien "Déconnexion" si l'utilisateur est connecté */}
          {isLoggedIn && <Nav.Link href="#" className="mx-3">Déconnexion</Nav.Link>}
        </Nav>
        
        {/* Affiche l'avatar et le nom de l'utilisateur uniquement si l'utilisateur est connecté */}
        {isLoggedIn && (
          <div className="d-flex align-items-center position-absolute end-0 me-3">
            <div
              className="rounded-circle bg-secondary"
              style={{ width: '40px', height: '40px' }}
            ></div>
            <span className="ms-2">{username}</span>
          </div>
        )}
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
