import React, { useState } from "react";
import { Button, Form, Container, Row, Col, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";




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
    <Container fluid>
      <Row className="w-100">
      <Col md={{ span: 6, offset: 3 }} lg={{ span: 5, offset: 3 }}>
         <Card>
          <Card.Header as="h6" className="border-bottom p-3 mb-0">
            <div >
              <h1 >로그인</h1>
              <p >로그인하여 Fit Connect를 이용해보세요</p>
            </div>
          </Card.Header>

          <Card.Body className="">

            <Form onSubmit={handleLogin} >
              <Form.Group controlId='formBasicEmail' >
                <Form.Label >아이디</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="아이디를 입력해 주세요"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                  
                />
              </Form.Group>
              <Form.Group controlId='formBasicPassword' >
                <Form.Label >비밀번호</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="비밀번호를 입력해 주세요"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                
                />
              </Form.Group>
              {errorMessage && <p className='text-danger'>{errorMessage}</p>}
              <Button variant="dark" type="submit" >
                로그인
              </Button>
              <div >또는</div>
              <Button variant="outline-dark"  as={Link} to="http://localhost:8080/oauth2/authorization/google">
                Google로 시작하기
              </Button>
              <div >
                <Link to="/signup" >회원가입</Link>
              </div>
            </Form>

          </Card.Body>
        </Card>
      </Col>
    </Row>     
  </Container>
);
};

export default UserLogin;