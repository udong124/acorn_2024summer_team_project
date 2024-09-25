import React, { useState } from 'react';
import { Button, Form, Container, Image } from 'react-bootstrap';
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
  const [profile, setProfile] = useState(null);
  const [provider, setProvider] = useState('');
  const [file, setFile] = useState(null);
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


  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setProfile(URL.createObjectURL(selectedFile));
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    console.log("submit!")
   
  
    //프로필등록까지 UserSignUp에서 하기 (api   patch  /user) 
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
      // profile, //프로필등록 순서 : 회원가입할때 아이디비번비번확인 ->이름 이메일입력, !!프로필이미지등록,role등록 
      role,
      provider: 'normal'
    };


    axios.post('/user', data)
      .then(response => {
        if (response.data.isSuccess) {
          navigate(isTrainer ? '/trainersignup' : '/membersignup');
        } else {
          setErrorMessage('회원가입에 실패했습니다.');
        }
        console.log(response.data)
      })
      .catch(error => {
        console.error("회원가입 실패:", error);
        setErrorMessage('회원가입 중 오류가 발생했습니다.');
      });
  };
 

  const formData = new FormData();

  formData.append('profile', file);
  formData.append('userName', userName);
  formData.append('password', password);
  formData.append('name', name);
  formData.append('email', email);
  formData.append('role', role);
  formData.append('provider', provider);

  UserSignUp.mutate(formData);

  if(file){
    formData.append("profile", file);
  }

  axios
  .patch(`/user/update/info`, formData, {
    headers:{"Content-Type":"multipart/form-data"}
  })
  .then((response) => {
    console.log(response.data);
    navigate(`/`);
  }).catch((error) => {
    if (error.response && error.response.data) {
      console.error("서버 응답 오류:", error.response.data.message);
    } else {
      console.error("프로필 등록 실패:", error.message);
    }
  });



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


          <Form.Group className={cx('textCenter', 'mb4')}>
              <Form.Label>프로필 이미지 업로드</Form.Label>
              <div className={cx('profileContainer')}>
                {profile ? (
                  <Image
                    src={profile}
                    alt="Profile Preview"
                    className={cx('profileImgPreview')}
                  />
                ) : (
                  <label htmlFor="profileImg" Image src="holder.js/171x180" roundedCircle className={cx('uploadBtn')}>
                    프로필 이미지 추가
                  </label>
                )}
                <input
                  type="file"
                  id="profileImg"
                  className={cx('dNone')}
                  onChange={handleImageChange}
                  accept="image/*"
                />
              </div>
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