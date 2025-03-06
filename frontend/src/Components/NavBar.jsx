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
        <Navbar className="bg-body-tertiary fixed-top shadow-sm" style={{ height: '7vh' }}>
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
                ) : null
            }

            <Container>
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
                    <NavDropdown title={`${user.nom} ${user.prenom}`} className="justify-content-end">
                        <NavDropdown.Item onClick={handleLogout}>Se déconnecter</NavDropdown.Item>
                    </NavDropdown>
                )}
            </Container>
        </Navbar>
    );
}

export default NavBar;
