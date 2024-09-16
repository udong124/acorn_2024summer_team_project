import React, { useState } from 'react';
import { Button, Form, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../styles/style.module.css';


const TrainerInfo = () => {
  const [step, setStep]= useState(1);
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [trainer_insta, setTrainer_insta] = useState('');
  const [trainer_intro, setTrainer_intro] = useState('');
  const [gym_link, setGym_link] = useState('');
  const [gym_name, setGym_name] = useState('');
  const [file, setFile] = useState(null);
  const navigate = useNavigate();


  
  const handleNext= ()=>{
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
    const data = { profile, name, email, trainer_insta, trainer_intro, gym_link , gym_name };

    axios.post(`/trainerInfo/{trainer_num}/setup`, data)
      .then(response => {
        console.log(response.data);
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
      <p className="text-center"> 트레이너 기본 설정 </p>

      {step === 1 && (
        <Form>
          <Form.Group>
           <Form.Label>프로필 이미지 업로드</Form.Label>
           <div style={{marginBottom: '40px'}}></div>
           <div className='profileImgContainer'>
            {profile ? (
              <img
                src={profile}
                alt='Profile Preview'
                className={styles.profileImgPreview}
                />
            ) : (
                <label htmlFor="profileImg" className={styles.uploadBtn}>프로필 이미지 추가</label>
            )}
            <input
              type="file"
              id="profileImg"
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
            placeholder="이름을 입력해 주세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group>
           <Form.Label>이메일</Form.Label>
          <Form.Control
            type="email"
            placeholder="이메일을 입력해 주세요"
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
          <Form.Label>인스타그램</Form.Label>
          <Form.Control
            type="text"
            placeholder="개인 SNS 링크를 첨부해 주세요"
            value={trainer_insta}
            onChange={(e) => setTrainer_insta(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>자기소개</Form.Label>
          <Form.Control
            as="textarea"
            placeholder="자기소개를 입력해 주세요"
            rows={5}
            value={trainer_intro}
            onChange={(e) => setTrainer_intro(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>체육관 링크</Form.Label>
          <Form.Control
            type="text"
             placeholder="체육관 링크를 첨부해 주세요"
            value={gym_link}
            onChange={(e) => setGym_link(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>체육관 이름</Form.Label>
          <Form.Control
            type="text"
             placeholder="체육관 이름을 입력해 주세요"
            value={gym_name}
            onChange={(e) => setGym_name(e.target.value)}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="w-100 mt-3" as={Link} to="/">
        완료</Button>
      </Form>
      )}
      </div>
    </Container>
  );
};

export default TrainerInfo;
