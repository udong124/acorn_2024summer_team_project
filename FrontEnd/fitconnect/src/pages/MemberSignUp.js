import React, {  useState } from "react";
import { Button, Form, Container, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from '../css/MemberSignUp.module.css';
import classNames from 'classnames/bind';

//cx 함수 만들기
const cx = classNames.bind(styles); 

const MemberSignUp = () => {
  const [profile, setProfile] = useState(null);
  const [member_num, setMember_num] = useState("");
  const [trainer_num, setTrainer_num] =useState("");
  const [member_height, setMember_height] = useState("");
  const [member_weight, setMember_weight] = useState("");
  const [member_gender, setMember_gender] = useState("");
  const [plan, setPlan] = useState("");
  const [weeklyplan, setWeeklyplan] = useState("");
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isNaN(member_height) || isNaN(member_weight)) {
      console.error("키와 몸무게는 숫자여야 합니다.");
      return;
    }

    const formData = new FormData(e.target);

    //const memberData = {member_height, member_gender, plan, weeklyplan};

    //formData.append('profile', file);
    //formData.append('memberData', JSON.stringify(memberData));
    // formData.append('member_num', member_num);
    // formData.append('trainer_num', trainer_num);
    // formData.append('member_height', member_height);
    // formData.append('plan', plan);
    // formData.append('weeklyplan', weeklyplan);
    // formData.append('name', name);

    MemberSignUp.mutate(formData);

    axios
      .post(`/member`, formData)
      .then((response) => {
        console.log(response.data);
        navigate(`/`); //member 메인페이지로 바꾸기
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
              variant="dark"
              type="submit"
              className={cx('w-100', 'mt-3')}
              onClick={handleSubmit}
            >
              완료
            </Button>
          </Form>
      </div>
    </Container>
  );
};

export default MemberSignUp;
