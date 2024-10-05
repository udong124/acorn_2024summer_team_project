// src/components/MainContent.js
import React from 'react';
import { Card,Row,Col} from "react-bootstrap";


const Home = () => {
  return (
    <div className="home">
    <Row>
      <Col>
         <Card>
          <Card.Header as="h6" className="border-bottom p-3 mb-0">
            MainPage
          </Card.Header>
          <Card.Body className="">

          </Card.Body>
        </Card>
      </Col>
    </Row>     
    </div>
  );
};

export default Home;