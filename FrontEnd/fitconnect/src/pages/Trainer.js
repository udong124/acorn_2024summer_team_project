import React, { useState } from 'react';
import { Button, Form, Container } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Trainer = () => {
  
  const [trainerId, setTrainerId] = useState('');
  

  const handleTrainer = (e) => {
    e.preventDefault();
   const data = {trainerId}

    axios.post(`/trainer`, data)
      .then(response => {
      
       console.log(response.data);
      })
      .catch(error => {
        console.error("트레이너 아이디 등록 실패:", error);
      });
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" 
    style={{ minHeight: '100vh'}}>
       <div className="border border-primary border-1 rounded-3 p-5 w-75" 
       style={{ position: 'relative', padding: '40px', minHeight: '300px' }}>  
       <p className="text-center"> 트레이너 아이디 등록 </p>
      <Form onSubmit={handleTrainer}>
        <Form.Group>
          <Form.Label>트레이너 아이디</Form.Label>
          <Form.Control
            type="text"
            value={trainerId}
            onChange={(e) => setTrainerId(e.target.value)}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="w-100 mt-3">등록</Button>
      </Form>

      <div style={{marginBottom: '150px'}}></div>
     
        <Button variant="success" style={{position: 'absolute', right: '30px', bottom: '30px'}}>
        완료
      </Button>
      </div>
    </Container>
  );
};

export default Trainer;
