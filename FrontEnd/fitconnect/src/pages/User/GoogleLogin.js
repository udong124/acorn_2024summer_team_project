import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { decodeToken } from "jsontokens";
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';


const GoogleLogin = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const token = queryParams.get('token');
  const id = queryParams.get('id');
  const role = queryParams.get('role');

  useEffect(()=>{
    localStorage.token = "Bearer+" + token.slice(7);
  }, [token])

  useEffect(()=>{
    if(step === 1) {
      axios
      .patch("/user/update/role", { id, role: selectedRole })
      .then((res) => {
        console.log(res.data)
        setStep(2)
      })
      .catch((error) => {
        console.error("역할 업데이트 중 오류 발생:", error);
        alert("역할 업데이트에 실패했습니다. 다시 시도해주세요.");
      });
    }
    else if(step === 2){
      // 선택한 역할대로 회원정보등록 페이지로 이동하기
      if (selectedRole === "MEMBER") {
        navigate("/membersignup", {
          state: {
            member_num: id
          }
        });
      } else if (selectedRole === "TRAINER") {
        navigate("/trainersignup", {
          state: {
            trainer_num: id
          }
        });
      }
    }

  }, [step])

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedRole) {
      alert("역할을 선택해주세요.");
      return;
    }
    setStep(1);
  };

 //코드는 수정x, ui만 부트스트랩으로 수정함
 
  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
    <Row>
      <Col>
        <Card className="p-4 shadow-lg" style={{ width: "350px" }}>
          <Card.Body>
            <h2 className="text-center mb-4" style={{ fontSize: "1.5rem" }}>역할을 선택해주세요</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Check
                  type="radio"
                  label="회원"
                  name="role"
                  value="MEMBER"
                  checked={selectedRole === "MEMBER"}
                  onChange={handleRoleChange}
                  className="mb-2"
                  style={{ fontSize: "1.2rem" }}
                />
                <Form.Check
                  type="radio"
                  label="트레이너"
                  name="role"
                  value="TRAINER"
                  checked={selectedRole === "TRAINER"}
                  onChange={handleRoleChange}
                  style={{ fontSize: "1.2rem" }}
                />
              </Form.Group>
              <Button variant="dark" type="submit" className="w-100" style={{ fontSize: "1.2rem", padding: "10px" }}>
                계속
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </Container>
);
};

export default GoogleLogin;