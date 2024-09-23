import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/Mypage.css';
import { Col, Container, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const MyPage = () => {
  const [trainerInfo, setTrainerInfo] = useState({
    name:'',
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

  useEffect(() => {
<<<<<<< HEAD
    axios.get(`/trainer/userinfo`)
      .then(res => { 
        console.log(res.data)
        setTrainerInfo(res.data)
  })
=======
    axios.get(`/trainer`)
      .then(res => setTrainerInfo(res.data))
>>>>>>> 37d074d8e358ea5494d1f977b0fc02624b04a010
      .catch(err => console.log(err));
  }, []);



  return (
      <Container>
       <h1>Mypage</h1>
       <Row>
          <Col className='leftside'>
<<<<<<< HEAD
            <img src={trainerInfo.profile} alt="" />
=======
            <img src="{trainerInfo.profile_image_url}" alt="" />
>>>>>>> 37d074d8e358ea5494d1f977b0fc02624b04a010
              <p>이름: {trainerInfo.name}</p>
              <p>소갯글: {trainerInfo.trainer_intro}</p>
          </Col>
          <Col className='rightside'>
<<<<<<< HEAD
              <img src={trainerInfo.profile_image_url} alt="" />
              <p>아이디: {trainerInfo.id}</p>
              <p>이메일: {trainerInfo.email}</p>
              <p>생성일: {trainerInfo.regdate}</p>
=======
              <img src="{trainerInfo.profile_image_url}" alt="" />
              <p>고유 인식번호: {trainerInfo.trainer_num}</p>
              <p>아이디: {trainerInfo.user_id}</p>
              <p>이메일: {trainerInfo.email}</p>
              <p>생성일: {trainerInfo.trainer_created_at}</p>
>>>>>>> 37d074d8e358ea5494d1f977b0fc02624b04a010
              <p>트레이너 SNS: {trainerInfo.trainer_insta}</p>
              <p>헬스장이름: {trainerInfo.gym_name}</p>
              <p>헬스장위치: {trainerInfo.gym_link}</p>
            </Col>
          </Row>
<<<<<<< HEAD
          <button variant="primary" type="submit"  onClick={()=> navigate('/MypageDetail/')}>회원정보수정</button>
      
=======
          <button variant="primary" type="submit" onClick={()=> navigate('/MypageDetail/')}>회원정보수정</button>
            
>>>>>>> 37d074d8e358ea5494d1f977b0fc02624b04a010

      </Container>
  );
};

export default MyPage;
