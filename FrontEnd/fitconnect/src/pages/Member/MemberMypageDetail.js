import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Col, Container, Row, Form, Button, Card, InputGroup } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';

const MyPageDetail = () => {
  const [memberInfo, setMemberInfo] = useState({
    name: '',
    id: '',
    userName: '',
    email: '',
    profile: '',
    image: '',
    regdate: '',
    member_num: '',
    trainer_num: '',
    member_height: '',
    member_weight: '',
    member_gender: '',
    plan: '',
    weeklyplan: ''
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
      setMemberInfo(prevInfo => ({
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

      axios.get(`/member`)
      .then(res => {
        setMemberInfo(prevInfo => ({
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
      axios.patch("/user/update/info", memberInfo, {
        headers:{"Content-Type":"multipart/form-data"}
      })
      .then(res=>{
          console.log(res.data)
      })
      .catch(error=>{
          console.log(error)
      })
  
      axios.patch(`/member/update/info`, memberInfo)
      .then(res => {
        console.log(res.data)
      })
      .catch(err => console.log(err));

      axios.patch(`/member/update/plan`, memberInfo)
      .then(res => {
        console.log(res.data)
      })
      .catch(err => console.log(err));
  
      navigate(`/member/mypage`);
    }
  }, [memberInfo.trainer_num, isReady])

  //수정된 내용을 관리하는 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMemberInfo({
      ...memberInfo,
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
    setMemberInfo(prevInfo => ({
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

    if (isNaN(memberInfo.member_height) || isNaN(memberInfo.member_weight)) {
      console.error("키와 몸무게는 숫자여야 합니다.");
      return;
    }

    console.log(memberInfo)
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
                    <Form.Control onChange={handleImageChange} ref={imageInput} style={{display:"none"}} type="file" name="image" accept="image/*" />
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
                    value={memberInfo.name}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="formTrainerName">
                  <Form.Label>담당 트레이너</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      name="trainer_num"
                      value={memberInfo.trainer_num ? memberInfo.trainer_num : "트레이너 등록"}
                      onClick={() => navigate(`/member/trainerlist`)}
                      readOnly
                      style={{cursor: "pointer"}}
                    />
                    <InputGroup.Text
                      onClick={() => navigate(`/member/trainerlist`)}
                      style={{cursor: "pointer"}}
                    >
                      <FaSearch/>
                    </InputGroup.Text>
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col className='rightside'>
                <Form.Group controlId="formId">
                  <Form.Label>아이디</Form.Label>
                  <Form.Control
                    type="text"
                    name="userName"
                    value={memberInfo.userName}
                    disabled
                  />
                </Form.Group>
                <Form.Group controlId="formEmail">
                  <Form.Label>이메일</Form.Label>
                  <Form.Control
                    type="text"
                    name="email"
                    value={memberInfo.email}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="formRegDate">
                  <Form.Label>생성일</Form.Label>
                  <Form.Control
                    type="text"
                    name="regdate"
                    value={memberInfo.regdate}
                    disabled
                  />
                </Form.Group>
                <Form.Group controlId="formHeight">
                  <Form.Label>키</Form.Label>
                  <Form.Control
                    type="text"
                    name="member_height"
                    value={memberInfo.member_height}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="formWeight">
                  <Form.Label>몸무게</Form.Label>
                  <Form.Control
                    type="text"
                    name="member_weight"
                    value={memberInfo.member_weight}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="formGender">
                  <Form.Label>성별</Form.Label>
                  <Form.Control
                    type="text"
                    name="member_gender"
                    value={memberInfo.member_gender}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="formPlan">
                  <Form.Label>목표</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="plan"
                    value={memberInfo.plan}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="formWeeklyPlan">
                  <Form.Label>주간목표</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="weeklyplan"
                    value={memberInfo.weeklyplan}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <br/>
            <Button variant="primary" type="submit" className="ml-2">
              저장
            </Button>
            <Button variant="secondary" onClick={() => navigate('/member/mypage')} className="ml-2">
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