import React from 'react';
import './css/Sidebar.css'
import { NavLink } from 'react-router-dom';
import { Col, Container, Nav } from 'react-bootstrap';


function Sidebar() {
    return (
        <Container className='sidebar'>
            <Nav className='nav'>
                <Col>
                    <Nav.Link as={NavLink} to="/members">회원목록</Nav.Link>
                </Col>
                <Col>
                    <Nav.Link as={NavLink} to='/message'>메신저</Nav.Link>
                </Col>
                <Col>
                    <Nav.Link as={NavLink} to='/calendar'>캘린더</Nav.Link>  
                </Col>
            </Nav>
        </Container>
    );
}

export default Sidebar;