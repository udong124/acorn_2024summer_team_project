import React, { useState } from 'react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserLogin = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    axios.post('/auth', { userName, password })
      .then(response => {
        console.log(response.data);
        navigate(`/`); 
      })
      .catch(error => {
        setErrorMessage('로그인 실패 : 아이디 또는 비밀번호가 틀렸습니다.');
        console.error("로그인 실패:", error);
      });
  };


  const handleSignup = (e)=>{
    e.preventDefault();
    navigate(`/signup`);
  }

  return (
    <Container fluid className="d-flex align-items-center justify-content-center" 
      style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Row className="w-100">
        <Col md={{ span: 6, offset: 3 }} lg={{ span: 5, offset: 3 }}>
          <div className="text-center mb-4">
            <h1 className="fw-bold" style={{ fontSize: '2.5rem' }}>로그인</h1>
            <p className="text-muted" style={{ fontSize: '1.2rem' }}>로그인하여 Fit Connect를 이용해보세요</p>
          </div>
          <Form onSubmit={handleLogin} className="border p-5 rounded shadow-sm bg-white" style={{ fontSize: '1.1rem' }}>
            <Form.Group controlId='formBasicEmail' className="mb-4">
              <Form.Label className="fw-semibold" style={{ fontSize: '1.2rem' }}>아이디</Form.Label>
              <Form.Control
                type="text"
                placeholder="아이디를 입력해 주세요"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
                style={{ fontSize: '1.1rem', padding: '1rem' }}
              />
            </Form.Group>
            <Form.Group controlId='formBasicPassword' className="mb-4">
              <Form.Label className="fw-semibold" style={{ fontSize: '1.2rem' }}>비밀번호</Form.Label>
              <Form.Control
                type="password"
                placeholder="비밀번호를 입력해 주세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ fontSize: '1.1rem', padding: '1rem' }}
              />
            </Form.Group>
            {errorMessage && <p className='text-danger'>{errorMessage}</p>}
            <Button variant="dark" type="submit" className="w-100 mb-3" style={{ padding: '1rem', fontSize: '1.2rem' }}>
              로그인
            </Button>
            <div className="text-center mb-3">또는</div>
            <Button variant="outline-dark" className="w-100 mb-3" href="http://localhost:8888/oauth2/authorization/google" style={{ padding: '1rem', fontSize: '1.2rem' }}>
              Google로 시작하기
            </Button>
            <div className="text-center">
              <Link to="/signup" className="text-muted" style={{ fontSize: '1.1rem' }}>회원가입</Link>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default UserLogin;