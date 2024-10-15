import React, { useEffect, useState } from 'react';
import { Button, Form, Container, Row, Col, Card } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { decodeToken } from 'jsontokens';

const TrainerSignUp = () => {
  const [formData, setFormData] = useState({
    trainer_num: 0,
    trainer_insta: "",
    trainer_intro: "",
    gym_name: "",
    gym_link: ""
  });
  const [token, setToken] = useState("");
  const [isReady, setIsReady] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { trainer_num } = location.state; 

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    setFormData(prevData => ({
      ...prevData,
      trainer_num: trainer_num
    }));
  }, []);
  
  useEffect(()=>{
    if(formData.trainer_num !== 0 && token !== "" && isReady) {
      axios
      .post(`/trainer`, formData, {
        headers: {
          Authorization: `${token}`
        }
      })
      .then(response => {
        if(response.data.isSuccess){
          const token = localStorage.getItem('token');
          const { payload } = decodeToken(token.substring(7));
          
          localStorage.setItem("role", "TRAINER")
          localStorage.setItem("userName", payload?.userName)
          localStorage.setItem("name", payload?.name)
          navigate(`/trainer`);

        }
      })
      .catch(error => {
        if (error.response && error.response.data) {
          console.error(
            "서버 응답 오류:",
            error.response?.data?.message || error.message
          ); 
        }
      });
    }
  }, [formData, token, isReady])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsReady(true);
  };

  return (
    <Container>
    <Row>
      <Col>
         <Card>
          <Card.Header as="h6" className="border-bottom p-3 mb-0">
          <p style={{fontSize: "1.5em", fontWeight: "bold"}}> 트레이너 기본 설정 </p>
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
