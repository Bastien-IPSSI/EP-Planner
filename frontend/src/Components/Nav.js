import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';

const CustomNavbar = () => {
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('user');

  useEffect(() => {

    fetch('/api/user', { 
      method: 'GET', 
      credentials: 'include' 
    })
      .then(response => response.json())
      .then(data => {
        if (data.isAuthenticated) {
          setIsLoggedIn(true); 
          setUsername(data.name); 
          setIsAdmin(data.role === 'Admin'); 
        } else {
          setIsLoggedIn(false);
        }
      })
      .catch(err => {
        console.error('Erreur lors de la récupération des données utilisateur:', err);
        setIsLoggedIn(false); 
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
