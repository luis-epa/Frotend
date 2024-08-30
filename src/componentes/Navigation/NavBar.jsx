import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";
import { NavDropdown } from "react-bootstrap";

function NavBarComponent() {
  const { isLoggedIn, logout, user } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/autenticacion/inicioSesion");
  };

  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="/">Tienda SA</Navbar.Brand>
          <Nav className="me-auto">
            {/* CATÁLOGO */}
            <Nav.Link as={Link} to="/catalogo">
              Catálogo
            </Nav.Link>

            {/* ADMINISTRADOR - USUARIOS */}
            {user?.rol === "Administrador" && (
              <>
                <NavDropdown title="Usuarios">
                  <NavDropdown.Item as={Link} to="/admin/usuarios/nuevoUsuario">
                    Crear
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to="/admin/usuarios/gestionUsuarios"
                  >
                    Gestionar
                  </NavDropdown.Item>
                </NavDropdown>
                <NavDropdown title="Juegos">
                  <NavDropdown.Item as={Link} to="/admin/catalogo/crearJuego">
                    Nuevo
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            )}
          </Nav>

          {/* PERFIL-REGISTRO-LOGIN/LOGOUT */}
          <Nav className="ms-auto">
            {isLoggedIn && <Nav.Link>Perfil</Nav.Link>}
            {!isLoggedIn && (
              <Nav.Link as={Link} to="/autenticacion/registro">
                Registro
              </Nav.Link>
            )}
            {!isLoggedIn ? (
              <Nav.Link as={Link} to="/autenticacion/inicioSesion">
                Iniciar sesión
              </Nav.Link>
            ) : (
              <Nav.Link as="button" onClick={handleLogout}>
                Salir
              </Nav.Link>
            )}
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default NavBarComponent;
