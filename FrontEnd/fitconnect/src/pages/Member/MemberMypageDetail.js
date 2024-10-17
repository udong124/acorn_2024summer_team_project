import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
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

  useEffect(() => {
    const savedMemberInfo = localStorage.getItem('memberInfo');
    if(savedMemberInfo) {
      setMemberInfo(JSON.parse(savedMemberInfo));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedInfo = { ...memberInfo, [name]: value };
    setMemberInfo(updatedInfo);
    
    // 데이터를 즉시 저장
    localStorage.setItem('memberInfo', JSON.stringify(updatedInfo));  
  };

  const [trainerName, setTrainerName] = useState("");

  useEffect(() => {
    const storedTrainerName = localStorage.getItem('selectedTrainerName');
    if (storedTrainerName && storedTrainerName !== "") {
      setTrainerName(storedTrainerName);
    } else {
      setTrainerName(null);
    }
  }, []);

  const handleNavigate = (path) => {
    localStorage.setItem('memberInfo', JSON.stringify(memberInfo));  // 페이지 이동 전에 반드시 저장
    setTimeout(() => navigate(path), 100);
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem('memberInfo', JSON.stringify(memberInfo));
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [memberInfo]);

  const [isReady, setIsReady] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const navigate = useNavigate();
  const imageInput = useRef();
  const dropZone = useRef();
  const personSvg = useRef();

  const dropZoneStyle={
    minHeight:"250px",
    minWidth:"250px",
    border:"3px solid #cecece",
    borderRadius:"10px",
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    cursor:"pointer"
  };

  const profileStyle={
    width: "200px",
    height: "200px",
    border: "1px solid #cecece",
    borderRadius: "50%"
  };

  const profileStyle2={
    width: "200px",
    height: "200px",
    border: "1px solid #cecece",
    borderRadius: "50%",
    display: "none"
  };

  useEffect(() => {
    axios.get(`/user`,{
      headers: {
        Authorization: localStorage.getItem('token')
      }
    })
      .then(res => {
      const savedInfo = JSON.parse(localStorage.getItem('memberInfo') || '{}');
      setMemberInfo(prevInfo => ({
        ...prevInfo,
        ...res.data,
        ...savedInfo
      }));
      if(res.data.profile){
        setImageSrc(`http://52.78.38.12:8080/upload/${res.data.profile}`)
      }else{
        const svgString=new XMLSerializer().serializeToString(personSvg.current)
        const encodedData = btoa(svgString)
        const dataUrl = "data:image/svg+xml;base64," + encodedData;
        setImageSrc(dataUrl)
      }

      axios.get(`/member`, {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      })
      .then(res => {
        setMemberInfo(prevInfo => ({
          ...prevInfo,
          ...res.data,
          ...savedInfo
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
  
      navigate(`/member/mypage`, 0);
    }
  }, [memberInfo, isReady])

  const handleImageChange = (e)=>{
    const file=e.target.files[0]
    const reader=new FileReader()
    reader.readAsDataURL(file)
    reader.onload=(event)=>{
        const data=event.target.result
        setImageSrc(data)
    }
    setMemberInfo(prevInfo => ({
      ...prevInfo,
      image: file
    }));
  }

  const handleDrop = (e)=>{
    e.preventDefault()
    const file=e.dataTransfer.files[0];	
    const reg=/image/;
    if(!reg.test(file.type)){
      console.log("이미지 파일이 아닙니다")
      return;
    }

    const reader=new FileReader()
    reader.readAsDataURL(file)
    reader.onload=(event)=>{
      const data=event.target.result
      setImageSrc(data)
    }

    imageInput.current.files=e.dataTransfer.files;
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isNaN(memberInfo.member_height) || isNaN(memberInfo.member_weight)) {
      console.error("키와 몸무게는 숫자여야 합니다.");
      return;
    }
    console.log(memberInfo)
    localStorage.removeItem('memberInfo');
    localStorage.removeItem('updatedInfo');
    setIsReady(true);
  };

  const handleCancel = (e)=>{
    localStorage.removeItem('memberInfo');
    localStorage.removeItem('updatedInfo');
  }

  // 회원탈퇴 핸들러
  const handleDelete = () =>{
    const confirmDelete = window.confirm("정말로 삭제하시겠습니까? 모든정보가 사라집니다.");
    if(confirmDelete){
      axios.delete(`/member`)
      .then(() =>
        axios.delete(`/user`)
        .then(()=> {
          alert("삭제되었습니다");
          localStorage.removeItem("userName")
          localStorage.removeItem("memberInfo")
          navigate((`/`));
          window.location.reload()
          }
        )
      )
    }else{
      console.log("취소됨")
    }
  }


  return (
    <Container>
      <Row>
        <Col>
          <Card>
            <Card.Header as="h6" className="border-bottom p-3 mb-0">
              <p style={{fontSize: "2em", fontWeight: "bold"}}>수정페이지</p>
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
                          name="trainerName"
                          value={trainerName ? trainerName : "트레이너 등록"}
                          onClick={() => {
                            handleNavigate('/member/trainerlist');
                          }} 
                          readOnly
                          style={{cursor: "pointer"}}
                        />
                      <Link to="/member/trainerlist" style={{ textDecoration: 'none' }}></Link>
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
                      <Form.Text className="text-muted">아이디는 수정할 수 없습니다.</Form.Text>
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
                      <Form.Text className="text-muted">생성일은 수정할 수 없습니다.</Form.Text>
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
                        disabled
                      />
                      <Form.Text className="text-muted">성별은 수정할 수 없습니다.</Form.Text>
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
                <Button variant="secondary" onClick={handleCancel}
                  as={Link} to="/member/mypage" className="ml-2">
                  취소
                </Button>
                <Button variant="danger" onClick={handleDelete}>회원탈퇴</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>     
    </Container>
  );
};

export default MyPageDetail;