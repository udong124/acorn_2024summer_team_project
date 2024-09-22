import React, { useState } from 'react';
import { Button, Form, Container } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate} from 'react-router-dom';
import styles from "../css/TrainerGetList.module.css";
import classNames from "classnames/bind";

//cx함수 만들기
const cx = classNames.bind(styles);

const TrainerGetList = () => {
  
  const [trainerId, setTrainerId] = useState('');
  const [member_num, setMember_num] = useState('');
  const [trainer_num, setTrainer_num] = useState('');
  const navigate= useNavigate();

  
  const handleTrainerID = (e) => {
    e.preventDefault();
    const data = {trainer_num, member_num};

    axios.patch(`/member/update/trainer`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
      
       console.log(response.data);
       navigate(`/`);
      })
      .catch(error => {
        console.error("트레이너 아이디 등록 실패:", error);
      });
  };


  return (
    <Container className={cx('trainerContainer')}>
      <div className={cx('trainerBox')}>
        <p className={cx('textCenter')}>트레이너 아이디 등록</p>
        <Form onSubmit={handleTrainerID}>
          <Form.Group>
            <Form.Label>트레이너 아이디</Form.Label>
            <Form.Control
              type="text"
              value={trainerId}
              onChange={(e) => setTrainerId(e.target.value)}
              required
              className={cx('formControl')}
            />
          </Form.Group>
          <Button variant="primary" type="submit" className={cx('btnPrimary', 'mt3')}>
            등록
          </Button>
          <div className={cx('marginBottom')}></div>
          <Button variant="primary" className={cx('btnPrimaryAbsolute', 'mt3')} type="submit" onClick={handleTrainerID}>
            완료
          </Button>
        </Form>
        <div className={cx('marginBottom')}></div>
      </div>
    </Container>
  );
};

// 이 컴포넌트는 member만 접근 가능하도록 설정
TrainerGetList.allowedRoles = ['member'];

export default TrainerGetList;