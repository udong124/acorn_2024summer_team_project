import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Col, Container, Row, Form, Button, Card } from 'react-bootstrap';


const MyPageDetail = () => {
  const [trainerInfo, setTrainerInfo] = useState({
    name: '',
    id: '',
    email: '',
    regdate: '',
    profile: '',
    trainer_insta: '',
    trainer_intro: '',
    gym_name: '',
    gym_link: ''
  });

  const navigate = useNavigate();

  //회원정보 수정 페이지에서 본인의 정보를 가져오는 axios.get요청
  useEffect(() => {
    axios.get(`/trainer`)
      .then(res => {setTrainerInfo(res.data)})
      .catch(err => console.log(err));
  }, []);


  //수정된 내용을 관리하는 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTrainerInfo({
      ...trainerInfo,
      [name]: value,
    });
  };



  //회원정보 수정 페이지에서 본인의 정보를 수정하는 axios.patch 요청
  const handleSubmit = (e) => {
    
    axios.patch(`/trainer/update/info`, trainerInfo)
      .then(res => {setTrainerInfo(res.data)
      })
      .catch(err => console.log(err));
      navigate(`/tr/mypage`);
  };

  return (
    <Container>
    <Row>
      <Col>
         <Card>
          <Card.Header as="h6" className="border-bottom p-3 mb-0">
            <h1>수정페이지</h1>
          </Card.Header>
          <Card.Body className="">

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col className='leftside'>
                <Form.Group controlId="formProfile">
                  <Form.Label>프로필사진</Form.Label>
                  <Form.Control
                    type="text"
                    name="profile"
                    value={trainerInfo.profile}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="formName">
                  <Form.Label>이름</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={trainerInfo.name}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="formIntro">
                  <Form.Label>소갯글</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="trainer_intro"
                    value={trainerInfo.trainer_intro}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col className='rightside'>
                <Form.Group controlId="formId">
                  <Form.Label>아이디</Form.Label>
                  <Form.Control
                    type="text"
                    name="id"
                    value={trainerInfo.id}
                    disabled
                  />
                </Form.Group>
                <Form.Group controlId="formEmail">
                  <Form.Label>이메일</Form.Label>
                  <Form.Control
                    type="text"
                    name="email"
                    value={trainerInfo.email}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="formRegDate">
                  <Form.Label>생성일</Form.Label>
                  <Form.Control
                    type="text"
                    name="regdate"
                    value={trainerInfo.regdate}
                    disabled
                  />
                </Form.Group>
                <Form.Group controlId="formInsta">
                  <Form.Label>트레이너 SNS</Form.Label>
                  <Form.Control
                    type="text"
                    name="trainer_insta"
                    value={trainerInfo.trainer_insta}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="formGymName">
                  <Form.Label>헬스장이름</Form.Label>
                  <Form.Control
                    type="text"
                    name="gym_name"
                    value={trainerInfo.gym_name}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="formGymLink">
                  <Form.Label>헬스장위치</Form.Label>
                  <Form.Control
                    type="text"
                    name="gym_link"
                    value={trainerInfo.gym_link}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button variant="primary" type="submit">
              저장
            </Button>
            <Button variant="secondary" onClick={() => navigate('/tr/mypage')} className="ml-2">
              취소
            </Button>
          </Form>

          </Card.Body>
        </Card>
      </Col>
    </Row>     
    </Container>
  );
};

export default MyPageDetail;