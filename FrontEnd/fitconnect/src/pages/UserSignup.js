import React, { useState } from 'react';
import { Button, Form, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from "../css/UserSignUp.module.css";
import classNames from "classnames/bind";

//cx함수 만들기
const cx = classNames.bind(styles);


const UserSignUp = () => {
  const [step, setStep] = useState(1);
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [isTrainer, setIsTrainer] = useState(false);
  const navigate = useNavigate();


  const handleNext = () => {
  if (!userName || !password || !confirmPassword) {
    setErrorMessage('모든 필드를 입력해 주세요.');
    return; 
  }

  if (password !== confirmPassword) {
    setErrorMessage('비밀번호가 일치하지 않습니다.');
    return;
  }
  setErrorMessage('');
  setStep(step + 1);
};


  const handleSignup = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage('비밀번호가 일치하지 않습니다.');
      return;  
    }
  
    if (!email.includes('@')) {
      setEmailErrorMessage('유효한 이메일 주소를 입력하세요.');
      return;
    }
   
    setErrorMessage('');
    setEmailErrorMessage('');

    const data = {
      userName,
      password,
      name,
      email,
      role,
      provider: 'normal'
    };

    axios.post('/user', data, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (response.data.isSuccess) {
          navigate(isTrainer ? '/trainer' : '/member');
        } else {
          setErrorMessage(response.data.message || '회원가입에 실패했습니다.');
        }
      })
      .catch(error => {
        console.error("회원가입 실패:", error);
        setErrorMessage('회원가입 중 오류가 발생했습니다.');
      });
  };
 


  return (
    <Container className={cx('centerContainer')}>
    <div className={cx('signupForm')}>
      <h3 className={cx('textCenter', 'mb4')}>회원가입</h3>
      {step === 1 && (
      <Form onSubmit={handleSignup}>
        <Form.Group className={cx('mb3')}>
          <Form.Label className={cx('fwBold')}>아이디</Form.Label>
          <Form.Control
            type="text"
            placeholder="아이디를 입력해 주세요"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
            className={cx('formControl')}
          />
        </Form.Group>
        <Form.Group className={cx('mb3')}>
          <Form.Label className={cx('fwBold')}>비밀번호</Form.Label>
          <Form.Control
            type="password"
            placeholder="비밀번호를 입력해 주세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={cx('formControl')}
          />
        </Form.Group>
        <Form.Group className={cx('mb3')}>
          <Form.Label className={cx('fwBold')}>비밀번호 확인</Form.Label>
          <Form.Control
            type="password"
            placeholder="비밀번호를 다시 입력해 주세요"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className={cx('formControl')}
          />
        </Form.Group>
        {errorMessage && <p className='text-danger'>{errorMessage}</p>}
        <Button variant='primary' className={cx('btnPrimary', 'mt3')} onClick={handleNext}>다음</Button>

        <div className={cx('textCenter')}>또는</div>
        <Button variant="outline-dark" className={cx('btnOutlineDark', 'mt2')} as={Link} to="http://localhost:8888/oauth2/authorization/google">
          Google Register
        </Button>
      </Form>
      )}

      {step === 2 && (
        <Form>
          <Form.Group className={cx('mb3')}>
            <Form.Label className={cx('fwBold')}>이름</Form.Label>
            <Form.Control
              type="text"
              placeholder='이름을 입력해 주세요'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={cx('formControl')}
            />
          </Form.Group>
          <Form.Group className={cx('mb3')}>
            <Form.Label className={cx('fwBold')}>이메일</Form.Label>
            <Form.Control
              type="email"
              placeholder='이메일을 입력해 주세요'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={cx('formControl')}
            />
             {emailErrorMessage && <p className='text-danger'>{emailErrorMessage}</p>}  
          </Form.Group>
          <Form.Group className={cx('mb3')}>
            <Form.Label className={cx('fwBold')}>사용자 구분</Form.Label>
            <Form.Control as="select"
             value={role}
             onChange={(e) => {
              setRole(e.target.value);
              setIsTrainer(e.target.value === 'trainer');  
            }}
            required
            className={cx('formControl')}
          >
              <option value="">사용자 선택</option>
              <option value="member">회원용</option>
              <option value="trainer">트레이너용</option>
          </Form.Control>
          </Form.Group>
          <Button variant="dark" type="submit" className={cx('btnPrimary', 'mb2')} onClick={handleSignup}>가입하기</Button>
        </Form>
      )}
    </div>
  </Container>
);
};

export default UserSignUp;