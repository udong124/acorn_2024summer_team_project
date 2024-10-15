import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import binder from 'classnames/bind'
import { Col, Container, Row, Card, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import TrainerMypage from './css/TrainerMypage.css'


const MyPage = () => {
  const [trainerInfo, setTrainerInfo] = useState({
    name:'',
    id: '',
    userName: '',
    email: '',
    regdate: '',
    profile: '',
    trainer_insta: '',
    trainer_intro: '',
    gym_name: '',
    gym_link: '',
    password:'',
  });
  // 프로필 이미지 src 에 적용할 값을 state 로 관리 하기
  const [imageSrc, setImageSrc] = useState(null);

  const personSvg = useRef();
  // 이미지 input 요소의 참조값을 사용하기 위해 
  const imageInput = useRef()

  const navigate = useNavigate();



  // 본인정보를 가져오는 axios.get 요청
  useEffect(() => {
    axios.get(`/user`, {
      headers: {
        Authorization: localStorage.getItem('token')
      }
    })
    .then(res => {
      setTrainerInfo(prevInfo => ({
        ...prevInfo,
        ...res.data
      }));
      //만일 등록된 프로필 이미지가 있다면
      if(res.data.profile){
        setImageSrc(`http://52.78.38.12:8080/upload/${res.data.profile}`)
      }else{//없다면 
        // person svg 이미지를 읽어들여서 data url 로 만든다음 imageSrc 에 반영하기 
        // svg 이미지를 2 진 데이터 문자열로 읽어들여서 
        const svgString=new XMLSerializer().serializeToString(personSvg.current)
        // 2진데이터 문자열을 btoa (binary to ascii) 함수를 이용해서 ascii 코드로 변경
        const encodedData = btoa(svgString)
        // 변경된 ascii 코드를 이용해서 dataUrl 을 구성한다 
        const dataUrl = "data:image/svg+xml;base64," + encodedData;
        setImageSrc(dataUrl)
        console.log(dataUrl)
      }

      axios.get(`/trainer`, {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      })
      .then(res => { 
        setTrainerInfo(prevInfo => ({
          ...prevInfo,
          ...res.data
        }));
      })
      .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
  }, []);



  return (
    <>
      <img src={`/img/—Pngtree—instagram icon instagram logo_3584853.png`} alt="" />
      <Container className='TrainerMypage-container'>
      <Row>
      <Col>
         <Card>
          <Card.Header as="h6" className='TrainerMypage-header'>
            <p style={{fontSize: "2em", fontWeight: "bold"}}>Mypage</p>
          </Card.Header>
          <Card.Body className="">
            
              <Row className='TrainerMypage-row'>
                <Col className='TrainerMypage-left'>
                <Form.Group>
                <Form.Label></Form.Label>
                    <Form.Control ref={imageInput} style={{display:"none"}} type="file" name="image" accept="image/*"/>
                    </Form.Group>
                  <div className="Trainerdrop-zone">
                    <div>
                        <img className="TrainerProfile-image" src={imageSrc} alt="프로필 이미지"/>
                    </div>
                  </div>
                  <p className='TrainerProfile-name'>{trainerInfo.name}</p>
                  <p className='TrainerProfile-intro'>소갯글: {trainerInfo.trainer_intro}</p>
                </Col>
                <Col className='TrainerMypage-right TrainerMypage-info'>
                  <p>아이디: {trainerInfo.userName}</p>
                  <p>이메일: {trainerInfo.email}</p>
                  <p>생성일: {trainerInfo.regdate}</p>
                  <p>패스워드: {trainerInfo.password}</p>
  
                  <p>
                    {<a href={trainerInfo.trainer_insta} target="_blank" rel="noopener noreferrer">
                        <b>트레이너 SNS</b>
                      </a>}
                  </p>
                  <p>헬스장이름: {trainerInfo.gym_name}</p>
                  <p>
                    {<a href={trainerInfo.gym_link} target="_blank" rel="noopener noreferrer">
                        <b>헬스장 위치</b>
                      </a>}
                  </p>
                </Col>
              </Row>
              <Button className='update-button'  onClick={()=> navigate('/trainer/mypagedetail')}>회원정보수정</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>     
      </Container>
    </>
  );
};

export default MyPage;