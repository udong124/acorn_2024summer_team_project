import React, { useEffect, useState } from 'react';
import axios from 'axios';
import myCss from './css/Mypage.module.css';
import binder from 'classnames/bind'
import { Col, Container, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const cx=binder.bind(myCss)

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
    axios.get(`/trainer`)
      .then(res => { 
        console.log(res.data)
        setTrainerInfo(res.data)
  })
      .catch(err => console.log(err));
  }, []);



  return (
      <Container className={cx('container')}>
       <h1>Mypage</h1>
       <Row>
          <Col className={cx("leftside")}>
            <img src={trainerInfo.profile} alt="" />
              <p>이름: {trainerInfo.name}</p>
              <p>소갯글: {trainerInfo.trainer_intro}</p>
          </Col>
          <Col className={cx('rightside')}>
              <p>아이디: {trainerInfo.id}</p>
              <p>이메일: {trainerInfo.email}</p>
              <p>생성일: {trainerInfo.regdate}</p>
              <p>트레이너 SNS: {trainerInfo.trainer_insta}</p>
              <p>헬스장이름: {trainerInfo.gym_name}</p>
              <p>헬스장위치: {trainerInfo.gym_link}</p>
            </Col>
          </Row>
          <button type="submit"  onClick={()=> navigate('/MypageDetail/')}>회원정보수정</button>
      

      </Container>
  );
};

export default MyPage;
