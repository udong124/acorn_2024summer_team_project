import React, { useEffect, useState } from "react";
import { Button, Form, Container, Row, Col, Card } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import { decodeToken } from 'jsontokens';

const UserLogin = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

 // Google 로그인 성공 후 역할에 따라 페이지 이동
 useEffect(() => {
  const queryParams = new URLSearchParams(location.search);
  const googleToken = queryParams.get("token");
  const googleRole = queryParams.get("role");

  if (googleToken) {
    try {
      const decoded = decodeToken(googleToken.substring(7)); 
      const userName = decoded?.payload?.userName;

      if (userName) {
        localStorage.setItem("userName", userName); // 유저 이름 저장
      }

      // 역할에 따라 navigate
      handleNavigation(googleRole);
    } catch (error) {
      console.error("토큰 디코딩 중 오류:", error);
    }
  }
}, [location]);

const handleNavigation = (role) => {
  if (role === "TRAINER") {
    navigate("/tr/home");
  } else if (role === "MEMBER") {
    navigate("/mem/starter");
  } else if (role === "ADMIN") {
    navigate("/");
  } else {
    console.error("올바르지 않은 역할:", role);
  }
};


  const handleLogin = (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setErrorMessage("비밀번호는 6자 이상이어야 합니다.");
      return;
    }

    axios.post("/auth", { userName, password }
      )
      .then((response) => {
        const { token, role } = response.data;
        if (token) {
          localStorage.setItem("token", token);
          localStorage.setItem("userName", userName); //로그인된 사용자이름 표시해주기 위해
          //로그인해서 얻은 role을 서버에서 가져오기 

          //로그인 성공 알림
          alert(`${userName} 님 로그인 되었습니다.`);

         // 역할에 따라 이동해주기 state를 생략할지
         if (role === "TRAINER") {
          const trainerNum = localStorage.getItem("trainer_num");
          navigate("/tr/home", {
            state: {
              trainer_num: trainerNum,
            },
          });
        } else if (role === "MEMBER") {
          const memberNum = localStorage.getItem("member_num");
          navigate("/mem/starter", {
            state: {
              member_num: memberNum,
            },
          });
        } else if (role === "ADMIN") {
          const token = localStorage.getItem("token");
          if (token) {
            try {
              const { payload } = decodeToken(token.substring(7));
              const adminNum = payload?.user_num;
              navigate("/", {
                state: {
                  admin_num: adminNum,
                },
              });
            } catch (error) {
              console.error("토큰 디코딩 중 오류:", error);
            }
          }
        }
    } else {
      // 로그인 token이 없을 때
      throw new Error("로그인 실패: 아이디 또는 비밀번호가 틀렸습니다.");
    }
  })
  .catch((error) => {
    setErrorMessage(error.message);
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
              <Button variant="outline-dark"  as={Link} to="http://localhost:8888/oauth2/authorization/google">
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