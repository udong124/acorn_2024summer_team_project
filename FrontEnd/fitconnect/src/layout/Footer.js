import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

function Footer() {
  return (
    <footer className="bg-dark text-light py-3" sticky='bottom'>
      <Container>
        <Row>
          <Col md={6}>
            <p>&copy; 2024 My Company. All rights reserved.</p>
          </Col>
          <Col md={6} className="text-md-right">
            <a href="/privacy" className="text-light">Privacy Policy</a> | 
            <a href="/terms" className="text-light"> Terms of Service</a>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;