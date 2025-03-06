import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useUser } from '../UserContext';

function NavBar() {
    const { user, logout } = useUser();

    const handleLogout = async () => {
        await logout();
        window.location.href = '/login';
    };

    return (
        <Navbar 
            expand="lg" 
            className="navbar-dark bg-dark fixed-top shadow-lg" 
            style={{ height: '9vh'}}
        >
            <Container>
                {user ? (
                    user.role === 'ROLE_ADMIN' ? (
                        <Navbar.Brand href="/admin/chantiers">
                            <img 
                                src="Logo_Final.png" 
                                alt="Logo" 
                                style={{ height: '7vh' }}  
                            />
                        </Navbar.Brand>
                    ) : (
                        <Navbar.Brand href="/chantiers">
                            <img 
                                src="Logo_Final.png" 
                                alt="Logo" 
                                style={{ height: '7vh' }}  
                            />
                        </Navbar.Brand>
                    )
                ) : null}
                
                <Navbar.Toggle aria-controls="navbar-nav" />
                <Navbar.Collapse id="navbar-nav">
                    <Nav className="me-auto">
                        { user ? (
                            user.role === 'ROLE_ADMIN' ? (
                                <>
                                    <Nav.Link href="/admin/chantiers">Gérer les chantiers</Nav.Link>
                                    <Nav.Link href="/admin/ouvriers">Gérer les ouvriers</Nav.Link>
                                </>
                            ) : (
                                <Nav.Link href="/chantiers">Voir mes chantiers</Nav.Link>
                            )
                        ) : (
                            <Nav.Link href="/login">Se connecter</Nav.Link>
                        )
                        }
                    </Nav>
                    {user && (
                        <Nav>
                            <NavDropdown title={`${user.nom} ${user.prenom}`} id="nav-dropdown" align="end">
                                <NavDropdown.Item onClick={handleLogout}>Se déconnecter</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    )}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavBar;
