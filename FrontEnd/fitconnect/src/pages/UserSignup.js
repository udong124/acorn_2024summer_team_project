import React, { useEffect, useState } from "react";
import { Row, Col, Card, Button, Form, Container, Image } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { decodeToken } from 'jsontokens';
import { Provider } from "react-redux";

function UserSignUp() {
  //폼에 입력한 내용을 상태값으로 관리
  const [step, setStep] = useState(1);
  const [id, setId] = useState(0);
  const [formData, setFormData] = useState({
    id:0,
    userName:"",
    password:"",
    newPassword:"",
    name:"",
    email:"",
    role:"",
    profile:"",
    provider:"normal",
    providerid:"",
    file:""
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState("");

  const navigate = useNavigate();

  useEffect(()=>{
    console.log(formData.id)
    if(step === 3) {
      if(formData.role === "TRAINER") {
        navigate("/trainersignup", {
          state: {
            trainer_num: formData.id
          }
        });
      } else if(formData.role === "MEMBER") {
        navigate("/membersignup", {
          state: {
            member_num: formData.id
          }
        });
      } else if (formData.role === "ADMIN") {
        // role:Admin 을 눌렀을 경우 Authentication token(required) 로 관리자를 구분하기
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const { payload } = decodeToken(token.substring(7)); 
            const adminNum = payload?.user_num; // payload에서 admin ID 추출 (id 필드는 백엔드에서 설정한 ID 필드에 맞게 수정)
            
            // adminNum과 함께 메인페이지 또는 관리자페이지로 이동하게
            navigate("/", {
              state: {
                admin_num: adminNum
              }
            });
          } catch (error) {
            console.error("토큰 디코딩 중 오류:", error);
          }
        }
      }
    }
  }, [id])

  // 아이디, 비밀번호, 이메일을 입력했을때 호출되는 함수 
  const handleChange = (e)=>{
    // e.target 은 object 이다. object 의 내용을 분해 할당
    const {name, value} = e.target

    setFormData({
        ...formData,
        [name]:value
    })
  }

  const handleNext = () => {
    if (!formData.userName || !formData.password || !formData.newPassword) {
      setErrorMessage("모든 필드를 입력해 주세요.");
      return;
    }

    if (formData.password !== formData.newPassword) {
      setErrorMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage("비밀번호는 6자 이상이어야 합니다.");
      return;
    }

    setErrorMessage("");
    setStep(2);
  };

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFormData({
        ...formData,
        "file":selectedFile,
        "profile":URL.createObjectURL(selectedFile)
      })
    }
  };

  const handleSubmit = (e)=>{
    e.preventDefault()

    if (!formData.email.includes("@")) {
      setEmailErrorMessage("유효한 이메일 주소를 입력하세요.");
      return;
    }

    //axios 를 이용해서 현재까지 입력한 회원정보를 전송한다.
    axios.post("/user", formData)
    .then(res=>{
      if (res.data.isSuccess) {
        setFormData({
          ...formData,
          "id":res.data.id
        })
        setId(res.data.id)
      }
      else {
        console.log("존재하는 아이디입니다.")
        return
      }

      if(formData.file){
        axios.patch("/user/update/info", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((profileResponse) => {
          if (profileResponse.data) {
            console.log("프로필 이미지 등록 성공", profileResponse.data);
          }
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            console.error(
              "프로필 이미지 등록 실패:",
              error.response.data.message
            );
          } else {
            console.error("프로필 이미지 등록 실패:", error.message);
          }
        });
      }

      axios.post("/auth", formData)
      .then((res) => {
        console.log(res.data)
        const token = res.data;
        localStorage.setItem("token", token);
        localStorage.setItem("userName", formData.userName); //로그인된 사용자이름 표시해주기 위해
        localStorage.setItem("role", formData.role)
      })
      .catch(error => {
        setErrorMessage(error.message);
        console.error("회원가입 실패:", error);
      })    
    })
    .catch(error=>{
        console.log(error)
    })

    setStep(3)
  };




  return (
    <Container >
    <Row>
      <Col>
         <Card>
          <Card.Header as="h6" className="border-bottom p-3 mb-0">
            <h3>회원가입</h3>
          </Card.Header>
          <Card.Body className="">
              {step === 1 && (
              <Form onSubmit={handleSubmit}>
                <Form.Group >
                  <Form.Label >아이디</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="아이디를 입력해 주세요"
                    name="userName"
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group >
                  <Form.Label >비밀번호</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="비밀번호를 입력해 주세요"
                    name="password"
                    onChange={handleChange}
                    required
                    
                  />
                  <div className="form-text">비밀번호를 6자 이상 입력해 주세요</div>
                </Form.Group>
                <Form.Group >
                  <Form.Label >비밀번호 확인</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="비밀번호를 다시 입력해 주세요"
                    name="newPassword"
                    onChange={handleChange}
                    required
                    
                  />
                </Form.Group>
                {errorMessage && <p className="text-danger">{errorMessage}</p>}
                <Button
                  variant="primary"
                  onClick={handleNext}
                >
                  다음
                </Button>
                
                <div >또는</div>
                <Button
                  variant="outline-dark"
                  
                  as={Link}   
                  to="http://localhost:8888/oauth2/authorization/google"
                >
                  Google Register
                </Button>
              </Form>
            )}

            {step === 2 && (
              <Form onSubmit={handleSubmit}>
                <Form.Group >
                  <Form.Label >이름</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="이름을 입력해 주세요"
                    name="name"
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group >
                  <Form.Label >이메일</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="이메일을 입력해 주세요"
                    name="email"
                    onChange={handleChange}
                    required
                  />
                  {emailErrorMessage && (
                    <p className="text-danger">{emailErrorMessage}</p>
                  )}
                  <div className="form-text">
                    이메일 형식에 맞게 입력해 주세요(@)
                  </div>
                </Form.Group>

                <Form.Group >
                  <Form.Label>프로필 이미지 업로드</Form.Label>
                  <div>
                    {formData.profile ? (
                      <Image
                        src={formData.profile}
                        alt="Profile Preview"
                        roundedCircle
                      />
                    ) : (
                      <label htmlFor="profileImg">
                        프로필 이미지 추가
                      </label>
                    )}
                    <input
                      type="file"
                      id="profileImg"
                      onChange={handleImageChange}
                      accept="image/*"
                    />
                  </div>
                </Form.Group>
                <Form.Group >
                  <Form.Label >사용자 구분</Form.Label>
                  <Form.Control
                    as="select"
                    name="role"
                    onChange={handleChange}
                    required
                  >
                    <option value="">사용자 선택</option>
                    <option value="MEMBER">회원용</option>
                    <option value="TRAINER">트레이너용</option>
                    <option value="ADMIN">관리자용</option>
                  </Form.Control>
                </Form.Group>
                <Button
                  variant="dark"
                  type="submit"
                >
                  가입하기
                </Button>
              </Form>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>    
    </Container>
  );
}

export default UserSignUp;
