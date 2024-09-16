import React, { useState } from 'react';
import { Button, Form, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../styles/style.module.css';

const MemberInfo = () => {
  const [step, setStep]=useState(1);
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [member_height, setMember_height] = useState('');
  const [member_weight, setMember_weight] = useState('');
  const [member_gender, setMember_gender] = useState('');
  const [plan, setPlan] = useState('');
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleNext = ()=>{
    setStep(step +1);
  }

 const handleImageChange = (e) => {
  const selectedFile = e.target.files[0];
  if(selectedFile) {
    setFile(selectedFile);
    setProfile(URL.createObjectURL(selectedFile));
  }
 };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { profile, name, email, member_height, member_weight, member_gender, plan };

    axios.post(`/memberInfo/{member_num}/setup`, data)
      .then(response => {
        console.log(response.data)
        navigate(`/`);
      })
      .catch(error => {
        console.error("프로필 등록 실패:", error);
      });
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" 
    style={{ minHeight: '100vh'}}>
      <div className="border border-primary border-1 rounded-3 p-5 w-75" >
      <p className="text-center"> 회원 기본 설정 </p>

      {step === 1 && (
        <Form>
          <Form.Group>
           <Form.Label>프로필 이미지 업로드</Form.Label>
           <div style={{marginBottom: '40px'}}></div>
           <div className='profileContainer'>
            {profile ?  (
              <img
                src={profile}
                alt='Profile Preview'
                className={styles.profileImgPreview}
              />
            ) : (
              <label htmlFor='profileImg' className={styles.uploadBtn}>프로필 이미지 추가</label>
            )}

          <input 
            type='file'
            id='profileImg'
            className='d-none'
            onChange={handleImageChange}
            accept='image/*'
          />
          </div>
        </Form.Group>
        <Form.Group>
           <Form.Label>이름</Form.Label>
          <Form.Control
            type="text"
            placeholder='이름을 입력해 주세요'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group>
           <Form.Label>이메일</Form.Label>
          <Form.Control
            type="email"
            placeholder='이메일을 입력해 주세요'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
       <Button variant='primary' className='mt-3' onClick={handleNext}>다음</Button>
        </Form>
        

      )}

      {step === 2 && (
      <Form onSubmit={handleSubmit}>
        <Form.Group>
           <Form.Label>키</Form.Label>
          <Form.Control
            type="text"
            placeholder="키를 입력해 주세요"
            value={member_height}
            onChange={(e) => setMember_height(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group>
           <Form.Label>몸무게</Form.Label>
          <Form.Control
            type="text"
            placeholder="몸무게를 입력해 주세요"
            value={member_weight}
            onChange={(e) => setMember_weight(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>성별</Form.Label>
          <Form.Control as="select" value={member_gender} onChange={(e) => setMember_gender(e.target.value)} required>
            <option value="">성별 선택</option>
            <option value="male">남성</option>
            <option value="female">여성</option>
          </Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>개인 목표</Form.Label>
          <Form.Control
            as="textarea"
            placeholder="개인목표를 입력해 주세요"
            rows={5}
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="w-100 mt-3" as={Link} to="/">완료</Button>
      </Form>
      )}
      </div>
    </Container>
  );
};

export default MemberInfo;
