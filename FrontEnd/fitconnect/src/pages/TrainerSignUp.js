import React, { useEffect, useState } from 'react';
import { Button, Form, Container, Row, Col, Card } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const token = localStorage.getItem("token");

const TrainerSignUp = () => {
  const [formData, setFormData] = useState({
    trainer_num: 0,
    trainer_insta: "",
    trainer_intro: "",
    gym_name: "",
    gym_link: ""
  });
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const location = useLocation();
  const { trainer_num } = location.state; 

useEffect(() => {
  setFormData(prevData => ({
    ...prevData,
    trainer_num: trainer_num
  }));
}, []);

useEffect(()=>{
  if(step === 1 && formData.trainer_num !== 0) {
    axios.post(`/trainer`, formData)
    .then(response => {
      console.log(response.data);
      navigate(`/tr/home`);  //트레이너정보등록까지 마치면 트레이너메인페이지로 가게
    })
    .catch(error => {
      if (error.response && error.response.data) {
        console.error("서버 응답 오류:", error.response?.data?.message || error.message); 
      }
    });
  }
})

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData({
    ...formData,
    [name]: value,
  });
};

  const handleSubmit = (e) => {
    e.preventDefault();

    setStep(1)
  };

  return (
    <Container>
    <Row>
      <Col>
         <Card>
          <Card.Header as="h6" className="border-bottom p-3 mb-0">
            <h4 > 트레이너 기본 설정 </h4>
          </Card.Header>
          <Card.Body className="">
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>인스타그램</Form.Label>
              <Form.Control
                type="text"
                name="trainer_insta"
                placeholder="개인 SNS 링크를 첨부해 주세요"
                value={formData.trainer_insta}
                onChange={handleChange}
                
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>자기소개</Form.Label>
              <Form.Control
                as="textarea"
                name="trainer_intro"
                placeholder="자기소개를 입력해 주세요"
                rows={5}
                value={formData.trainer_intro}
                onChange={handleChange}
              
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>체육관 이름</Form.Label>
              <Form.Control
                type="text"
                name="gym_name"
                placeholder="체육관 이름을 입력해 주세요"
                value={formData.gym_name}
                onChange={handleChange}
                
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>체육관 링크</Form.Label>
              <Form.Control
                type="text"
                name="gym_link"
                placeholder="체육관 링크를 첨부해 주세요"
                value={formData.gym_link}
                onChange={handleChange}
              
              />
            </Form.Group>
            <Button variant="dark" type="submit" >
            완료</Button>
          </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>    
    </Container>
  );
};

export default TrainerSignUp;
