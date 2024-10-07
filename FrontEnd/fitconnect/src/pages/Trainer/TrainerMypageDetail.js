import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Col, Container, Row, Form, Button, Card } from 'react-bootstrap';

const MyPageDetail = () => {
  const [trainerInfo, setTrainerInfo] = useState({
    name: '',
    userName: '',
    id: '',
    trainer_num: '',
    email: '',
    regdate: '',
    profile: '',
    image: '',
    trainer_insta: '',
    trainer_intro: '',
    gym_name: '',
    gym_link: ''
  });
  const [isReady, setIsReady] = useState(false);

  // 프로필 이미지 src 에 적용할 값을 state 로 관리 하기
  const [imageSrc, setImageSrc] = useState(null)

  const navigate = useNavigate();

  // 이미지 input 요소의 참조값을 사용하기 위해 
  const imageInput = useRef()
  // drop zone div 요소의 참조값을 사용하기 위해 
  const dropZone = useRef()
  const personSvg = useRef()

  const dropZoneStyle={
    minHeight:"250px",
    minWidth:"250px",
    border:"3px solid #cecece",
    borderRadius:"10px",
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    cursor:"pointer"
  }
  const profileStyle={
    width: "200px",
    height: "200px",
    border: "1px solid #cecece",
    borderRadius: "50%"
  }
  const profileStyle2={
    width: "200px",
    height: "200px",
    border: "1px solid #cecece",
    borderRadius: "50%",
    display: "none"
  }

  //회원정보 수정 페이지에서 본인의 정보를 가져오는 axios.get요청
  useEffect(() => {

    axios.get(`/user`)
    .then(res => {
      setTrainerInfo(prevInfo => ({
        ...prevInfo,
        ...res.data
      }));
      //만일 등록된 프로필 이미지가 있다면
      if(res.data.profile){
        setImageSrc(`/home/upload/${res.data.profile}`)
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

      axios.get(`/trainer`)
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

  useEffect(()=>{
    if(isReady) {
      axios.patch("/user/update/info", trainerInfo, {
        headers:{"Content-Type":"multipart/form-data"}
      })
      .then(res=>{
          console.log(res.data)
      })
      .catch(error=>{
          console.log(error)
      })
  
      axios.patch(`/trainer/update/info`, trainerInfo)
      .then(res => {
        console.log(res.data)
      })
      .catch(err => console.log(err));

      axios.patch(`/trainer/update/gyminfo`, trainerInfo)
      .then(res => {
        console.log(res.data)
      })
      .catch(err => console.log(err));
  
      navigate(`/trainer/mypage`);
    }
  }, [trainerInfo.trainer_num, isReady])

  //수정된 내용을 관리하는 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTrainerInfo({
      ...trainerInfo,
      [name]: value,
    });
  };

  // input type="file" 요소에 change 이벤트가 일어 났을때 호출되는 함수 
  const handleImageChange = (e)=>{
    //선택한 파일 객체
    const file=e.target.files[0]
    //파일로 부터 데이터를 읽어들일 객체 생성
    const reader=new FileReader()
    //파일을 DataURL 형식의 문자열로 읽어들이기
    reader.readAsDataURL(file)
    //로딩이 완료(파일데이터를 모드 읽었을때) 되었을때 실행할 함수 등록
    reader.onload=(event)=>{
        //읽은 파일 데이터 얻어내기 
        const data=event.target.result
        setImageSrc(data)
    }
    setTrainerInfo(prevInfo => ({
      ...prevInfo,
      image: file
    }));
  }

  // drop zone div 에 drop 이벤트가 일어 났을때 호출되는 함수 
  const handleDrop = (e)=>{
    e.preventDefault()
    //drop 된 파일 객체 얻어내기 
    const file=e.dataTransfer.files[0];	
    const reg=/image/;
    if(!reg.test(file.type)){ //파일의 type 이 만일 정규표현식을 통과하지 못하면
      console.log("이미지 파일이 아닙니다")
      return;
    }

    //파일로 부터 데이터를 읽어들일 객체 생성
    const reader=new FileReader()
    //파일을 DataURL 형식의 문자열로 읽어들이기
    reader.readAsDataURL(file)
    //로딩이 완료(파일데이터를 모드 읽었을때) 되었을때 실행할 함수 등록
    reader.onload=(event)=>{
      //읽은 파일 데이터 얻어내기 
      const data=event.target.result
      setImageSrc(data)
    }

    // input 요소에 drop 된 파일의 정보 넣어주기 
    imageInput.current.files=e.dataTransfer.files;
  }

  //회원정보 수정 페이지에서 본인의 정보를 수정하는 axios.patch 요청
  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(trainerInfo)
    setIsReady(true);
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

          <svg ref={personSvg} style={profileStyle2}  xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
            <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
          </svg>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col className='leftside'>
                <Form.Group>
                    <Form.Label>프로필사진 ( click or drag-drop to Edit ) </Form.Label>
                    <Form.Control onChange={handleImageChange} ref={imageInput} style={{display:"none"}} type="file" name="image" accept="image/*"/>
                </Form.Group>
                <div className="mb-3">
                    <a href="about:blank" onClick={(e)=>{
                        e.preventDefault()
                        // input  type="file" 요소를 강제 클릭 
                        imageInput.current.click()
                    }}>
                        <div style={dropZoneStyle} ref={dropZone} onDragOver={(e)=>e.preventDefault()} onDrop={handleDrop}>
                            <img style={profileStyle} src={imageSrc} alt="프로필 이미지"/>
                        </div>
                    </a>
                </div>
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
                    name="userName"
                    value={trainerInfo.userName}
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
            <br/>
            <Button variant="primary" type="submit" className="ml-2">
              저장
            </Button>
            <Button variant="secondary" onClick={() => navigate('/trainer/mypage')} className="ml-2">
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