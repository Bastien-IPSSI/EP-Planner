import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useState } from 'react';
function NavBar() {
      const [isAdmin, setIsAdmin] = useState(true);
      // Probablement a modifier avec le AuthContext
      const [currentUser, setCurrentUser] = useState("Jhon Doe")
    //   const [isLoggedIn, setIsLoggedIn] = useState(true);

  return (
    <Navbar className="bg-body-tertiary">
      {<Navbar.Brand href="#home">Nom de solution</Navbar.Brand>}
    <Container>
    <Nav className="me-auto">
            {isAdmin
                ?<Nav.Link href="/admin/chantiers">Gérer les chantiers</Nav.Link>
                :<Nav.Link href="/chantiers">Voir mes chantiers</Nav.Link>
            }
            {isAdmin && <Nav.Link href="/admin/ouvriers">Gérer les ouvriers</Nav.Link>}
      </Nav>
      <NavDropdown title={currentUser} className="justify-content-end">
      <NavDropdown.Item href="#action/3.1">Se déconnecter</NavDropdown.Item>
      </NavDropdown>
    </Container>
  </Navbar>
  );
}

export default NavBar;