import React, { useEffect, useState, useRef } from 'react'
import { Row, Col, Card, Button, Form} from "react-bootstrap";
import { useNavigate } from 'react-router';
import axios from 'axios'

const MemberMyPage = () => {
  const [formData, setFormData] = useState({
    id:"",
    userName:"",
    password:"",
    newPassword:"",
    name:"",
    email:"",
    profile:"",
    trainer:"",
    role:"",
    regdate:"",
    provider:"",
    trainer_num:""
  })

  const [originalData, setOriginalData] = useState(null)
  const [emailError, setEmailError]=useState("")
  const [profileView, setProfileView]=useState("")

  const token= localStorage.getItem('token')||sessionStorage.getItem('token')
  const navigate = useNavigate()
  const profileInput = useRef(null)

  useEffect(()=>{
      if(!token) return
      axios.get('/user',{
        headers:{Authorization:`Bearer ${token}`}
      })
      .then(res=>{console.log(res.data)
          setFormData({
            id: res.data.id,
            userName: res.data.userName,
            password: "",
            name: res.data.name,
            email: res.data.email,
            trainer_num:""
          })
          setOriginalData(res.data)
          setProfileView(res.data.profile)
      })
      .catch(error=>console.log(error))
      
      axios.get('/trainer',{
          headers:{ Authorization:`Bearer ${token}`}
      })
      .then(res=>{
          setFormData((prevState)=>({
              ...prevState,
              trainer_num: res.data.trainer_num
          }))
      })
      .catch(error=>{console.log(error)})
  },[token])

  const handleChange = (e) => {
      setFormData({
          ...formData,
          [e.target.name]:e.target.value
      })

      if(e.target.name === 'email'){
          const emailComfirm = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if(!emailComfirm.test(e.target.value)){
              setEmailError("유효한 이메일 형식이 아닙니다.")
            if(e.target.value == "")
              setEmailError("")
          }
          else{
              setEmailError("")
          }
      }
  }

  const handleProfileChange = (e)=>{
      const profileChangeFile = e.target.files[0]
      if(profileChangeFile){
          setProfileView(URL.createObjectURL(profileChangeFile))
          
          const reader = new FileReader()
          reader.onloadend = ()=>{
              setFormData({
                  ...formData,
                  profile: reader.result
              })
          }
          reader.readAsDataURL(profileChangeFile)
      }
  }

  const handleChangeSubmit = (e)=>{
      e.preventDefault()
      
      if(JSON.stringify(formData)==JSON.stringify(originalData)){
          alert("수정된 내용이 없습니다")
          return
      }

      if(formData.password !== formData.newPassword){
          if(formData.password==="" || formData.newPassword===""){
              alert("비밀번호를 입력해주세요")
              return
          }
          else{
          alert("비밀번호가 일치하지 않습니다.")
          return
          }
      }

      axios.patch('/user/update/info',{
          profile:formData.profile,
          userName:formData.userName,
          name:formData.name,
          email:formData.email,
      })
      .then(res=>{
          console.log(res.data)
          navigate('/user/MemberDashBoard')
      })
      .catch(error=>console.log(error))

      if(formData.newPassword){
          axios.patch('/user/update/password',{
              newPassword:formData.newPassword
          },{
              headers:{
                  Authorization: `Bearer ${token}`,
                  'Content-Type':"application/json"
              }
          })
          .then(res=>{
              console.log(res.data)
              navigate('/user/MemberDashBoard')
          })
          .catch(error=>console.log(error))
      }
  }

  const handleTrainerDelete=(e)=>{
      e.preventDefault()
      axios.delete('/trainer',{
          headers:{Authorization:`Bearer ${token}`}
      })
      .then(res=>{
          console.log(res.data)
          setFormData({...formData, trainer_num:""})
      })
      .catch(error=>{
          console.log(error)
          return
      })
  }

  return (
    <Row>
      <Col>
         <Card>
          <Card.Header as="h6" className="border-bottom p-3 mb-0">
            <i className="bi bi-link me-2"> </i>
            회원정보 수정
          </Card.Header>
          <Card.Body className="">
            <Form onSubmit={handleChangeSubmit}>
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <div style={{ display: "inline-block", border: "1px solid black", padding: "10px"}}>
                    <img src={profileView || `/upload/images/`} alt="프로필 이미지" onClick={()=>profileInput.current.click()} style={{cursor: 'pointer', width:'150px', height:'150px', objectFit:'cover'}}/>
                    <input type="file" ref={profileInput} onChange={handleProfileChange} style={{display:'none'}} />
                </div></div>
                <Form.Group controlId='userName'>
                    <Form.Label>아이디</Form.Label>
                    <Form.Control readOnly name="userName" value={formData.userName} type="text" placeholder='아이디' />
                </Form.Group>

                <Form.Group controlId='name'>
                    <Form.Label>이름</Form.Label>
                    <Form.Control name="name" value={formData.name} type="text" onChange={handleChange} placeholder='이름'/>
                </Form.Group>

                <Form.Group controlId='email'>
                    <Form.Label>이메일</Form.Label>
                    {emailError && <p style={{color:'red'}}>{emailError}</p>}
                    <Form.Control name="email" value={formData.email} type="email" onChange={handleChange} placeholder='이메일'/>
                    
                </Form.Group>

                <Form.Group controlId='newPassword'>
                    <Form.Label>비밀번호</Form.Label>
                    <Form.Control name="password" value={formData.password} type="password" onChange={handleChange} placeholder='비밀번호'/>

                </Form.Group>
                <Form.Group>
                    <Form.Label>비밀번호 확인</Form.Label>
                    <Form.Control name="newPassword" value={formData.newPassword} type="password" onChange={handleChange} placeholder='비밀번호 확인'/>
                </Form.Group>
                <Form.Group controlId='trainer'>
                    <Form.Label>트레이너 번호</Form.Label>
                    <Form.Control readOnly name="trainer_num" value={formData.trainer_num||"등록된 트레이너 없음"} type="text" placeholder='트레이너 번호'/>
                <Button onClick={handleTrainerDelete}>트레이너 삭제</Button>
                </Form.Group>
                <Button type="submit">수정</Button>
                </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default MemberMyPage;