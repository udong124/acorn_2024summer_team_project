import React, { useState } from 'react';
import { Button, Form, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../css/TrainerSignUp.module.css'; 
import classNames from 'classnames/bind';

//cx함수 만들기
const cx=classNames.bind(styles);


const TrainerSignUp = () => {
  const [step, setStep]= useState(1);
  const [profile, setProfile] = useState(null);
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
    if (selectedFile) {
      setFile(selectedFile);
      setProfile(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const token = sessionStorage.getItem('token');

    const formData = new FormData();
    formData.append('trainer_insta', trainer_insta);
    formData.append('trainer_intro', trainer_intro);
    formData.append('gym_name', gym_name);
    formData.append('gym_link', gym_link);

    if (file) {
      formData.append('profile', file);  
    }

    axios.post(`/trainer`, formData,{
      headers: {
        'Content-Type': 'multipart/form-data',  
        'Authorization': `Bearer ${token}`  
      }
    })
      .then(response => {
        console.log(response.data);
        navigate(`/`);
      })
      .catch(error => {
        if (error.response && error.response.data) {
          console.error("서버 응답 오류:", error.response.data.message); 
        } else {
          console.error("프로필 등록 실패:", error.message);  
        }
      });
  };



  return (
    <Container className={cx('centerContainer')}>
      <div className={cx('signupForm')}>
        <h4 className={cx('textCenter')}> 트레이너 기본 설정 </h4>

      {step === 1 && (
        <Form>
          <Form.Group className={cx('textCenter', 'mb4')}>
           <Form.Label>프로필 이미지 업로드</Form.Label>
           <div className={cx('profileContainer')}>
            {profile ? (
              <img
                src={profile} 
                alt='Profile Preview'
                className={cx('profileImgPreview')}
                />
            ) : (
                <label htmlFor="profileImg" Image src="holder.js/171x180" roundedCircle className={cx('uploadBtn')}>프로필 이미지 추가</label>
            )}
            <input
              type="file"
              id="profileImg"
              className={cx('dNone')}
              onChange={handleImageChange}
              accept='image/*'
            />
            </div>
        </Form.Group>
      
       <Button variant='primary' className={cx('mt3')} onClick={handleNext}>다음</Button>
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
          <Form.Label>체육관 이름</Form.Label>
          <Form.Control
            type="text"
             placeholder="체육관 이름을 입력해 주세요"
            value={gym_name}
            onChange={(e) => setGym_name(e.target.value)}
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
        <Button variant="primary" type="submit" className={cx('w100', 'mt3')} onClick={handleSubmit}>
        완료</Button>
      </Form>
      )}
      </div>
    </Container>
  );
};

export default TrainerSignUp;
