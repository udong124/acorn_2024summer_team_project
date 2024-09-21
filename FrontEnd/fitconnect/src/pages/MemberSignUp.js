import React, { useState } from "react";
import { Button, Form, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from '../css/MemberSignUp.module.css';
import classNames from 'classnames/bind';

//cx 함수 만들기
const cx = classNames.bind(styles); 

const MemberSignUp = () => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState(null);
  const [member_height, setMember_height] = useState("");
  const [member_weight, setMember_weight] = useState("");
  const [member_gender, setMember_gender] = useState("");
  const [plan, setPlan] = useState("");
  const [weeklyplan, setWeeklyplan] = useState("");
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setProfile(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (isNaN(member_height) || isNaN(member_weight)) {
      console.error("키와 몸무게는 숫자여야 합니다.");
      return;
    }

    const formData = new FormData();
    formData.append("member_height", member_height);
    formData.append("member_gender", member_gender);
    formData.append("plan", plan);
    formData.append("weeklyplan", weeklyplan);

    if (file) {
      formData.append("profile", file);
    }

    axios
      .post(`/member`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        navigate(`/`);
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          console.error("서버 응답 오류:", error.response.data.message);
        } else {
          console.error("프로필 등록 실패:", error.message);
        }
      });
  };

  return (
    <Container className={cx('centerContainer')}>
      <div className={cx('signupForm')}>
        <h4 className={cx('textCenter')}> 회원 기본 설정 </h4>

        {step === 1 && (
          <Form>
            <Form.Group className={cx('textCenter', 'mb4')}>
              <Form.Label>프로필 이미지 업로드</Form.Label>
              <div className={cx('profileContainer')}>
                {profile ? (
                  <img
                    src={profile}
                    alt="Profile Preview"
                    className={cx('profileImgPreview')}
                  />
                ) : (
                  <label htmlFor="profileImg" className={cx('uploadBtn')}>
                    프로필 이미지 추가
                  </label>
                )}
                <input
                  type="file"
                  id="profileImg"
                  className={cx('d-none')}
                  onChange={handleImageChange}
                  accept="image/*"
                />
              </div>
            </Form.Group>

            <Button variant="primary" className={cx('mt-3')} onClick={handleNext}>
              다음
            </Button>
          </Form>
        )}

        {step === 2 && (
          <Form>
            <Form.Group>
              <Form.Label>키</Form.Label>
              <Form.Control
                type="text"
                placeholder="키를 입력해 주세요"
                value={member_height}
                onChange={(e) => setMember_height(e.target.value)}
                required
              />
              <Form.Control.Feedback>
                숫자로만 입력해 주세요
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label>몸무게</Form.Label>
              <Form.Control
                type="text"
                placeholder="몸무게를 입력해 주세요"
                value={member_weight}
                onChange={(e) => setMember_weight(e.target.value)}
                required
              />
              <Form.Control.Feedback>
                숫자로만 입력해 주세요
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label>성별</Form.Label>
              <Form.Control
                as="select"
                value={member_gender}
                onChange={(e) => setMember_gender(e.target.value)}
                required
              >
                <option value="">성별 선택</option>
                <option value="male">남성</option>
                <option value="female">여성</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>개인 목표</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="개인목표를 입력해 주세요"
                rows={4}
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>주간 목표</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="주간목표를 입력해 주세요"
                rows={4}
                value={weeklyplan}
                onChange={(e) => setWeeklyplan(e.target.value)}
                required
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              className={cx('w-100', 'mt-3')}
              onClick={handleSubmit}
            >
              완료
            </Button>
          </Form>
        )}
      </div>
    </Container>
  );
};

export default MemberSignUp;
