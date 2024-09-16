import React, { useState } from 'react';
import { Button, Form, Container, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserSignup = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [provider, setProvider] = useState('');
  const [providerId, setProviderId] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isTrainer, setIsTrainer] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(null);
  const [isCheckingUsername, setCheckingUsername] = useState(false);
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    const data = {
      userName,
      password,
      role: isTrainer ? 'trainer' : 'member'
    };

    axios.post('/signup', data)
      .then(response => {
        console.log(response.data);
        if (isTrainer) {
          navigate(`/trainerInfo/{trainer_num}/setup`);  
        } else {
          navigate(`/memberInfo/{member_num}/setup`); 
        }
      })
      .catch(error => {
        console.error("회원가입 실패:", error);
      });
  };

 

  const checkUsernameAvailability = () => {
    setCheckingUsername(true)
    axios.post('/api/check-userName', { userName })
      .then(response => {
        setIsUsernameAvailable(response.data.available);
      })
      .catch(error => {
        console.error("중복확인 실패:", error);
      }).finally(()=>{
        setCheckingUsername(false);
      });
  };

 

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <div className="border border-1 rounded-3 p-5 w-50" style={{ backgroundColor: '#f8f9fa' }}>
        <h3 className="text-center mb-4">회원용 회원가입</h3>
        <Form onSubmit={handleSignup}>
          <Form.Group className="mb-3">
            <Form.Label>아이디</Form.Label>
            <Form.Control
              type="text"
              placeholder="아이디를 입력해 주세요"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>비밀번호</Form.Label>
            <Form.Control
              type="password"
              placeholder="비밀번호를 입력해 주세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>비밀번호 확인</Form.Label>
            <Form.Control
              type="password"
              placeholder="비밀번호를 다시 입력해 주세요"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </Form.Group>
          {errorMessage && <p className='text-danger'>{errorMessage}</p>}
          <Button variant="dark" type="submit" className="w-100 mb-2">가입하기</Button>
        </Form>
        <div className="text-center">또는</div>
        <Button variant="outline-dark" className="w-100 mt-2" href='http://localhost:8888/oauth2/authorization/google'>
          Google Register
        </Button>
      </div>
    </Container>
  );
};

export default UserSignup;