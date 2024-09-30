import React, { useState } from "react";
import { Button, Form, Container, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../css/UserLogin.module.css";
import classNames from "classnames/bind";

//cx함수 만들기
const cx = classNames.bind(styles);

const UserLogin = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setErrorMessage("비밀번호는 6자 이상이어야 합니다.");
      return;
    }

    axios.post("/auth", { userName, password }
      )
      .then((response) => {
        const token = response.data;
        if (token) {
          localStorage.setItem("token", token);
          console.log("로그인 되었습니다")
          navigate(`/`);
        } else {
          setErrorMessage("로그인 실패: 아이디 또는 비밀번호가 틀렸습니다.");
        }
      })
      .catch((error) => {
        setErrorMessage("로그인 실패: 아이디 또는 비밀번호가 틀렸습니다.");
        console.error("로그인 실패:", error);
      });
  };

  return (
    <Container fluid className={cx('loginContainer')}>
    <Row className="w-100">
      <Col md={{ span: 6, offset: 3 }} lg={{ span: 5, offset: 3 }}>
        <div className={cx('textCenter', 'mb4')}>
          <h1 className={cx('fwBold', 'title')}>로그인</h1>
          <p className={cx('textMuted', 'subtitle')}>로그인하여 Fit Connect를 이용해보세요</p>
        </div>
        <Form onSubmit={handleLogin} className={cx('loginForm', 'shadowSm')}>
          <Form.Group controlId='formBasicEmail' className={cx('mb4')}>
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
          <Form.Group controlId='formBasicPassword' className={cx('mb4')}>
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
          {errorMessage && <p className='text-danger'>{errorMessage}</p>}
          <Button variant="dark" type="submit" className={cx('btnPrimary', 'mb3')}>
            로그인
          </Button>
          <div className={cx('textCenter', 'mb3')}>또는</div>
          <Button variant="outline-dark" className={cx('btnOutlineDark', 'mb3')} as={Link} to="http://localhost:8080/oauth2/authorization/google">
            Google로 시작하기
          </Button>
          <div className={cx('textCenter')}>
            <Link to="/signup" className={cx('textMuted')}>회원가입</Link>
          </div>
        </Form>
      </Col>
    </Row>
  </Container>
);
};

export default UserLogin;