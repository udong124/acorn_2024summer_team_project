import 'bootstrap/dist/css/bootstrap.min.css';
import {Container, Nav, Navbar} from "react-bootstrap";
import { Link } from 'react-router-dom';

function Header() {
  return (
    <>
      <Navbar style={{ backgroundColor: '#000000' }} data-bs-theme="dark" sticky='top'>
        <Container>
          <Navbar.Brand href="#home" as={Link} to={`/`}>Fit Connect</Navbar.Brand>
          <Nav className="ms-auto">
            <Nav.Link href="#Login" as={Link} to={`/login`}>Login</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;