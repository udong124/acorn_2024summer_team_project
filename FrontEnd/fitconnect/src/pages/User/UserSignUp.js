
import React, { useEffect, useRef, useState } from "react";
import { Row, Col, Card, Button, Form, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import profile from "../../assets/images/users/profile.png";

import { decodeToken } from 'jsontokens';

function UserSignUp() {
 //폼에 입력한 내용을 상태값으로 관리
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    id: 0,
    userName: "",
    password: "",
    newPassword: "",
    name: "",
    email: "",
    role: "",
    profile: "",
    provider: "normal",
    providerid: ""
  });
  const [isReady, setIsReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  // 프로필 이미지 src 에 적용할 값을 state 로 관리 하기
  const [imageSrc, setImageSrc] = useState(null);
  // 이미지 input 요소의 참조값을 사용하기  위해
  const imageInput = useRef();

  const [previewImage, setPreviewImage] = useState(null);

  const [isUsernameAvailable, setIsUsernameAvailable] = useState(null); // true: 사용 가능, false: 사용 불가
  const navigate = useNavigate();

  useEffect(()=>{
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    localStorage.removeItem('selectedTrainerName');
  }, [])

  useEffect(() => {
    if (formData.id !== 0 && localStorage.getItem("token") !== null && isReady) {
      if (formData.role === "TRAINER") {
        navigate("/trainersignup", {
          state: {
            trainer_num: formData.id
          }
        });
      } else if (formData.role === "MEMBER") {
        navigate("/membersignup", {
          state: {
            member_num: formData.id
          }
        });
      } else if (formData.role === "ADMIN") {
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const { payload } = decodeToken(token.substring(7));
            const adminNum = payload?.id;
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
  }, [formData, localStorage, isReady, navigate]);

  // 아이디, 비밀번호, 이메일을 입력했을때 호출되는 함수
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  const handleCheck = () => {
    const userName = formData.userName;
    axios.get(`/user/check/${userName}`)
      .then(res => {
        console.log(res);
        // 사용 가능 여부에 따라 상태를 업데이트
        if (res.data.canUse===true) {
          setIsUsernameAvailable(true);
        } else {
          setIsUsernameAvailable(false);
        }
      })
      .catch(error => {
        console.log(error);
        // 오류 발생 시 false로 설정할 수도 있습니다.
        setIsUsernameAvailable(false);
      });
  };

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

 // input type="file" 요소에 change 이벤트가 일어 났을때 호출되는 함수
  const handleImageChange = (e) => {
    const image = e.target.files[0];

    if (image) {
      const reg = /image/;
      if (!reg.test(image.type)) {
        console.error("이미지 파일이 아닙니다.");
        return;
      }

      //파일로 부터 데이터를 읽어들일 객체 생성
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = (event) => {
        const data = event.target.result;
        setPreviewImage(data);
        setImageSrc(data);
      };

      setFormData(prevInfo => ({
        ...prevInfo,
        image: image
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.email.includes("@")) {
      setEmailErrorMessage("유효한 이메일 주소를 입력하세요.");
      return;
    }

    // const formImage = new FormData();
    //안 들어갈 경우 formImage 로 7개를 보내주기
    // formImage.append("name", formData.name);
    // formImage.append("email", formData.email);
    // formImage.append("userName", formData.userName);
    // formImage.append("password", formData.password);
;
    // formImage.append("role", formData.role);
    // formImage.append("profile", formData.profile);
    // formImage.append("provider", formData.provider);


   // 입력한 회원정보를 전송하기
    axios.post("/user", formData, {
      headers: { 
        "Content-Type": "multipart/form-data"
      }
    })
      .then(res => {
        if (res.data.isSuccess) {
          setFormData({
            ...formData,
            "id": res.data.id
          });
        } else {
          console.log("존재하는 아이디입니다.");
          return;
        }

        if(formData.image) {
          //현재 선택한 파일을 form data 에 담아야한다 
          formData.append("image", imageInput.current.files[0]);
          console.log(imageInput.current.files[0])
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
          .then((authResponse) => {
            const token = authResponse.data;
            localStorage.setItem("token", token);
            localStorage.setItem("userName", formData.userName);
            localStorage.setItem("role", formData.role);
            localStorage.setItem("name", formData.name);

            setIsReady(true);
          })
          .catch(error => {
            setErrorMessage(error.message);
            console.error("회원가입 실패:", error);
          });
      })
      .catch(error => {
        console.log(error);
      });
  };

  const imageContainerStyle = {
    width: "250px",
    height: "200px",
    border: "1px solid #cecece",
    borderRadius: "50%",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    margin: "0 auto 20px"
  };

  const imageStyle = {
    width: "100%",
    height: "100%",
  };

  return (
    <Container>
      <Row>
        <Col>
          <Card>
            <Card.Header as="h6" className="border-bottom p-3 mb-0">
              <p className="h3">회원가입</p>
            </Card.Header>
            <Card.Body>
              {step === 1 && (
                <Form onSubmit={handleSubmit}>
                  <Form.Group>
                    <Form.Label>아이디</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="아이디를 입력해 주세요"
                      name="userName"
                      onChange={handleChange}
                      required
                    />
                      <Button onClick={handleCheck} type="button">중복 확인</Button> {/* type="button" 추가 */}
                      {isUsernameAvailable !== null && ( // null이 아닐 때만 피드백 메시지 표시
                        isUsernameAvailable ? (
                          <Form.Control.Feedback type="valid">
                            사용 가능한 아이디 입니다
                          </Form.Control.Feedback>
                        ) : (
                          <Form.Control.Feedback type="invalid">
                            사용 불가능한 아이디 입니다
                          </Form.Control.Feedback>
                        )
                      )}
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>비밀번호</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="비밀번호를 입력해 주세요"
                      name="password"
                      onChange={handleChange}
                      required
                    />
                    <div className="form-text">비밀번호를 6자 이상 입력해 주세요</div>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>비밀번호 확인</Form.Label>
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
                  <div>또는</div>
                  <Button
                    variant="outline-dark"
                    as={Link}
                    to="http://ec2-52-78-38-12.ap-northeast-2.compute.amazonaws.com:8080/oauth2/authorization/google"
                  >
                    Google Register
                  </Button>
                </Form>
              )}

              {step === 2 && (
                <Form onSubmit={handleSubmit}>
                  <Form.Group>
                    <Form.Label>이름</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="이름을 입력해 주세요"
                      name="name"
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>이메일</Form.Label>
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
                  <Form.Group>
                    <Form.Label>프로필 이미지 업로드</Form.Label>
                    <div>
                      <input
                        type="file"
                        onChange={handleImageChange}
                        ref={imageInput}
                        style={{ display: "none" }}
                        name="image"
                        accept="image/*"
                      />
                      <div
                        style={imageContainerStyle}
                        onClick={() => imageInput.current.click()}
                      >
                        <img
                          src={previewImage || profile}
                          style={imageStyle}
                          alt="Profile"
                        />
                      </div>
                      {!previewImage && (
                        <p className="text-center text-muted">
                          클릭하여 이미지 업로드
                        </p>
                      )}
                    </div>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>사용자 구분</Form.Label>
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
