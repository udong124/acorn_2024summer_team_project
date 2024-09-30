
import React, { useEffect, useState } from "react";
import { Button, Form, Container, Image } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../css/UserSignUp.module.css";
import classNames from "classnames/bind";
import { decodeToken } from 'jsontokens';

//cx함수 만들기
const cx = classNames.bind(styles);

const UserSignUp = () => {
  const [step, setStep] = useState(1);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setnewPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [profile, setProfile] = useState(null);
  const [providerid, setProviderid] = useState("");
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [isGoogleLogin, setIsGoogleLogin] = useState(false);
  const navigate = useNavigate();


  //구글연동:리다일렉트 페이지 이동후 구글을 통해 정보 받아와서 role에 따라 정보등록(회원/트레이너기본정보등록)페이지로 이동
  useEffect(() => {
    // localStorage에서 토큰을 가져와 확인
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const { payload } = decodeToken(token.substring(7)); 
      if (payload) {
        const { providerid, email, name } = payload;
        setProviderid(providerid); // 구글 ID를 providerid로 설정
        setEmail(email);
        setName(name);
        setIsGoogleLogin(true); // 구글 로그인 상태로 설정
      }
    } catch (error) {
      console.error("토큰 처리 중 오류:", error);
    }
  }, []);


  const handleNext = () => {
    if (!userName || !password || !newPassword) {
      setErrorMessage("모든 필드를 입력해 주세요.");
      return;
    }

    if (password !== newPassword) {
      setErrorMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("비밀번호는 6자 이상이어야 합니다.");
      return;
    }

    setErrorMessage("");
    setStep(step + 1);
  };

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setProfile(URL.createObjectURL(selectedFile));
    }
  };

  
    const userData = {
      userName: isGoogleLogin ? providerid : userName, //구글로그인시 providerid 전달하기
      password: isGoogleLogin ? null : password,
      name,
      email,
      //profile, //프로필등록 순서 : 회원가입할때 아이디비번비번확인 ->이름 이메일입력, !!프로필이미지등록,role등록
      role,
      provider: isGoogleLogin ? "google" : "normal"
    };

  
    //프로필등록까지 UserSignUp에서 하기 (api   patch  /user)
   

    const handleSignup = (e) => {
        e.preventDefault();
      if (!email.includes("@")) {
        setEmailErrorMessage("유효한 이메일 주소를 입력하세요.");
        return;
      }
    console.log(userData)
    axios
      .post("/user", userData)
      .then((response) => {
        if (response.data.isSuccess) {
          console.log("회원가입 진행중!");

          if (file) {
            const formData = new FormData();
            formData.append("userName", userName);
            formData.append("name", name);
            formData.append("email", email);
            formData.append("image", file);

            // profile 데이터를 multipart/form-data로 보내기  /보낼때는  file  받을 때는 profile 로 받기
            axios
              .patch("/user/update/info", formData, {
                headers: { "Content-Type": "multipart/form-data" },
              })
              .then((profileResponse) => {
                if (profileResponse.data) {
                  console.log("회원가입진행중")
                  console.log("프로필 이미지 등록 성공", profileResponse.data);
                  //role 버튼 누른 것에 따라 페이지 이동하기
                  if(role === "TRAINER") {
                    navigate("/trainersignup", {
                      state: {
                        trainer_num: response.data.trainer_num
                      }
                    });
                  } else if(role === "MEMBER") {
                    navigate("/membersignup", {
                      state: {
                        member_num: response.data.member_num
                      }
                    });
                  } else if (role === "ADMIN") {
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
            } else {
              // 프로필 이미지가 없을 때도 이동하게?
             if(role === "TRAINER") {
              navigate("/trainersignup", {
                state: {
                  trainer_num: response.data.trainer_num
                }
              });
             }else if(role === "MEMBER") {
              navigate("/membersignup", {
                state: {
                  member_num: response.data.member_num
                }
              });
            } else if (role === "ADMIN") {
              const token = localStorage.getItem('token');
              if (token) {
                try {
                  const { payload } = decodeToken(token.substring(7)); 
                  const adminNum = payload?.user_num; // payload에서 adminNum 추출  user_num이 맞나?
                  
                  navigate("/", {     //메인페이지 또는 관리자용페이지로 이동하게 
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
        } else {
          setErrorMessage("회원가입에 실패했습니다.");
        }
      })
      .catch((error) => {
        console.error("회원가입 실패:", error.response ? error.response.data :error.message);
        setErrorMessage("회원가입 중 오류가 발생했습니다.");
      });
  };


  return (
    <Container className={cx("centerContainer")}>
      <div className={cx("signupForm")}>
        <h3 className={cx("textCenter", "mb4")}>회원가입</h3>
        {step === 1 && (
          <Form onSubmit={handleSignup}>
            <Form.Group className={cx("mb3")}>
              <Form.Label className={cx("fwBold")}>아이디</Form.Label>
              <Form.Control
                type="text"
                placeholder="아이디를 입력해 주세요"
                value={isGoogleLogin ? providerid : userName}
                onChange={(e) => setUserName(e.target.value)}
                readOnly={isGoogleLogin} // 구글 로그인 시 읽기 전용
                required
                className={cx("formControl")}
              />
            </Form.Group>
            <Form.Group className={cx("mb3")}>
              <Form.Label className={cx("fwBold")}>비밀번호</Form.Label>
              <Form.Control
                type="password"
                placeholder="비밀번호를 입력해 주세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={cx("formControl")}
              />
              <div className="form-text">비밀번호를 6자 이상 입력해 주세요</div>
            </Form.Group>
            <Form.Group className={cx("mb3")}>
              <Form.Label className={cx("fwBold")}>비밀번호 확인</Form.Label>
              <Form.Control
                type="password"
                placeholder="비밀번호를 다시 입력해 주세요"
                value={newPassword}
                onChange={(e) => setnewPassword(e.target.value)}
                required
                className={cx("formControl")}
              />
            </Form.Group>
            {errorMessage && <p className="text-danger">{errorMessage}</p>}
            <Button
              variant="primary"
              className={cx("btnPrimary", "mt3")}
              onClick={handleNext}
            >
              다음
            </Button>

            <div className={cx("textCenter")}>또는</div>
            <Button
              variant="outline-dark"
              className={cx("btnOutlineDark", "mt2")}
              as={Link}
              to="http://localhost:8080/oauth2/authorization/google"
            >
              Google Register
            </Button>
          </Form>
        )}

        {step === 2 && (
          <Form>
            <Form.Group className={cx("mb3")}>
              <Form.Label className={cx("fwBold")}>이름</Form.Label>
              <Form.Control
                type="text"
                placeholder="이름을 입력해 주세요"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={cx("formControl")}
              />
            </Form.Group>
            <Form.Group className={cx("mb3")}>
              <Form.Label className={cx("fwBold")}>이메일</Form.Label>
              <Form.Control
                type="email"
                placeholder="이메일을 입력해 주세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={cx("formControl")}
              />
              {emailErrorMessage && (
                <p className="text-danger">{emailErrorMessage}</p>
              )}
              <div className="form-text">
                이메일 형식에 맞게 입력해 주세요(@)
              </div>
            </Form.Group>

            <Form.Group className={cx("textCenter", "mb4")}>
              <Form.Label>프로필 이미지 업로드</Form.Label>
              <div>
                {profile ? (
                  <Image
                    src={profile}
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
            <Form.Group className={cx("mb3")}>
              <Form.Label className={cx("fwBold")}>사용자 구분</Form.Label>
              <Form.Control
                as="select"
                value={role}
                onChange={(e) => {
                  setRole(e.target.value);
                }}
                required
                className={cx("formControl")}
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
              className={cx("btnPrimary", "mb2")}
              onClick={handleSignup}
            >
              가입하기
            </Button>
          </Form>
        )}
      </div>
    </Container>
  );
};

export default UserSignUp;

