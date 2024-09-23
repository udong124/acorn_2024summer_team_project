import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/Mypage.css';
import { Col, Container, Row, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const MyPageEdit = () => {
  const [trainerInfo, setTrainerInfo] = useState({
<<<<<<< HEAD
    name:'',
    id: '',
    email: '',
    regdate: '',
    profile: '',
=======
    trainer_num: '',
    name:'',
    user_id: '',
    email: '',
    trainer_created_at: '',
    profile_image_url: '',
>>>>>>> 37d074d8e358ea5494d1f977b0fc02624b04a010
    trainer_insta: '',
    trainer_intro: '',
    gym_name: '',
    gym_link: ''
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/trainer`)
      .then(res => {
        setTrainerInfo(res.data);
      })
      .catch(err => console.log(err));
  }, []);


  const handleChange = (e) => {
    e.preventDefault();
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    axios.patch(`/trainer/update`, trainerInfo)  
      .then(res => {
        alert('프로필 업데이트 완료');
        navigate('/mypage');
      })
      .catch(err => console.log(err));
  };



  return (
    <Container>
      <h1>프로필 수정</h1>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col className='leftside'>
            <Form.Group>
              <Form.Label>프로필이미지</Form.Label>
              <Form.Control 
                type="text"
                name="profile_image_url"
<<<<<<< HEAD
                value={trainerInfo.profile}
                onChange={handleChange}
              />
              <img src={trainerInfo.profile}/>
=======
                value={trainerInfo.profile_image_url}
                onChange={handleChange}
              />
              <img src={trainerInfo.profile_image_url}/>
>>>>>>> 37d074d8e358ea5494d1f977b0fc02624b04a010
            </Form.Group>

            <Form.Group>
              <Form.Label>소갯글</Form.Label>
              <Form.Control 
                as="textarea"
                name="trainer_intro"
                value={trainerInfo.trainer_intro}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          <Col className='rightside'>
            <Form.Group>
              <Form.Label>이름</Form.Label>
              <Form.Control 
                type="text"
                name="name"
                value={trainerInfo.name}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control 
                type="email"
                name="email"
                value={trainerInfo.email}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>SNS</Form.Label>
              <Form.Control 
                type="text"
                name="trainer_insta"
                value={trainerInfo.trainer_insta}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>헬스장 이름</Form.Label>
              <Form.Control 
                type="text"
                name="gym_name"
                value={trainerInfo.gym_name}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>헬스장 위치</Form.Label>
              <Form.Control 
                type="text"
                name="gym_link"
                value={trainerInfo.gym_link}
                onChange={handleChange}
              />
            </Form.Group>

          </Col>
        </Row>
        <Button variant="primary" type="submit" onClick={handleSubmit} >저장하기</Button>
      </Form>
    </Container>
  );
};

export default MyPageEdit;
