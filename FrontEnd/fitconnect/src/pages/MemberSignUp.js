import React, { useEffect, useState } from "react";
import { Button, Form, Container } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../css/MemberSignUp.module.css";
import classNames from "classnames/bind";

//cx 함수 만들기
const cx = classNames.bind(styles);

const MemberSignUp = () => {

  const [formData, setFormData] = useState({
    member_num: "",
    trainer_num: "",//회원이 회원가입한후 memberSignUp으로 넘어올때 트레이너번호? 트레이너검색기능이 membersignup에서 빠짐
    member_height: "",
    member_weight: "",
    member_gender: "",
    plan: "",
    weeklyplan: ""
  });

  const navigate = useNavigate();

  const location = useLocation();
  useEffect(() => {
    if(location.state && location.state.member_num) {
      setFormData(prevData => ({
        ...prevData,
        member_num: location.state.member_num
      }));
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isNaN(formData.member_height) || isNaN(formData.member_weight)) {
      console.error("키와 몸무게는 숫자여야 합니다.");
      return;
    }

    axios
      .post(`/member`, formData)
      .then((response) => {
        console.log(response.data);
        navigate(`/`); //합치게되면 경로를 member의 메인페이지로 바꾸기
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          console.error(
            "서버 응답 오류:",
            error.response.data.message || error.message
          );
        }
      });
  };

  return (
    <Container className={cx("centerContainer")}>
      <div className={cx("signupForm")}>
        <h4 className={cx("textCenter")}> 회원 기본 설정 </h4>
        <Form>
          <Form.Group>
            <Form.Label>키</Form.Label>
            <Form.Control
              type="text"
              name="member_height"
              placeholder="키를 입력해 주세요"
              value={formData.member_height}
              onChange={handleChange}
              className={cx("formControl")}
            />
            <small className={cx("formText")}>키는 숫자로만 입력해 주세요</small>
          </Form.Group>
          <Form.Group>
            <Form.Label>몸무게</Form.Label>
            <Form.Control
              type="text"
              name="member_weight"
              placeholder="몸무게를 입력해 주세요"
              value={formData.member_weight}
              onChange={handleChange}
              className={cx("formControl")}
            />
            <small className={cx("formText")}>몸무게는 숫자로만 입력해 주세요</small>
          </Form.Group>
          <Form.Group>
            <Form.Label>성별</Form.Label>
            <Form.Control
              as="select"
              name="member_gender"
              value={formData.member_gender}
              onChange={handleChange}
              className={cx("formControl")}
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
              name="plan"
              placeholder="개인목표를 입력해 주세요"
              rows={4}
              value={formData.plan}
              onChange={handleChange}
              className={cx("formControl")}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>주간 목표</Form.Label>
            <Form.Control
              as="textarea"
              name="weeklyplan"
              placeholder="주간목표를 입력해 주세요"
              rows={4}
              value={formData.weeklyplan}
              onChange={handleChange}
              className={cx("formControl")}
            />
          </Form.Group>
          <Button
            variant="dark"
            type="submit"
            className={cx("w-100", "mt-3")}
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
