import React, { useState, useEffect } from 'react';
import { Button, Form, Container, Card } from 'react-bootstrap';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import styles from "../css/TrainerId.module.css";
import classNames from "classnames/bind";

// cx 함수 만들기
const cx = classNames.bind(styles);

const TrainerId = () => {
  
  const [searchInput, setSearchInput] = useState({
    condition: "trainer_num", 
    keyword: ""
  });

  const [member_num, setMember_num] = useState(''); 
  const [trainer_num, setTrainer_num] = useState(''); // trainer_num 
  const [APIData, setAPIData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); 

  useEffect(() => {
    axios.get(`trainer/list`)
      .then((response) => {
        console.log(response.data); 
        setAPIData(response.data);
      })
      .catch(error => console.error("데이터 로드 실패:", error)); 
  }, []);
  
  const navigate = useNavigate();

  
  const handleSearch = () => {
    const filtered = APIData.filter(item => {
      if (searchInput.condition === "trainer_num") {
        return item.trainer_num.toString().includes(searchInput.keyword);
      } else if (searchInput.condition === "trainer_insta") {
        return item.trainer_insta && item.trainer_insta.toLowerCase().includes(searchInput.keyword.toLowerCase());
      }
      return false;
    });
    setFilteredData(filtered);
  };

  
  const handleTrainerInput = (e) => {
    e.preventDefault();

    // trainer_num과 member_num 데이터 전송
    const data = { trainer_num, member_num };
    axios.patch(`/member/update/trainer`, data)
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
        <p className={cx('textCenter')}>트레이너 검색</p>
        <Form onSubmit={handleTrainerInput}>
          <Form.Group className={cx('mb-3')}>
            <Form.Label>검색 조건 선택</Form.Label>
            <Form.Control
              as="select"
              value={searchInput.condition}
              onChange={(e) => setSearchInput({ ...searchInput, condition: e.target.value })}
              className={cx('formControl')}
            >
              <option value="trainer_num">트레이너 번호</option>
              <option value="trainer_insta">트레이너 인스타</option>
            </Form.Control>
          </Form.Group>

          <Form.Group className={cx('mb-3')}>
            <Form.Label>검색 키워드</Form.Label>
            <Form.Control
              type="text"
              placeholder="검색어를 입력하세요"
              value={searchInput.keyword}
              onChange={(e) => setSearchInput({ ...searchInput, keyword: e.target.value })}
              className={cx('formControl')}
            />
          </Form.Group>

          <Button variant="dark" onClick={handleSearch} className={cx('btnPrimary', 'mt3')}>
            검색
          </Button>

          <div className={cx('mb-3')}>
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <Card key={index} className={cx('mb-2')}>
                  <Card.Body>
                    <Card.Title>트레이너 번호: {item.trainer_num}</Card.Title>
                    <Card.Text>
                      인스타그램: {item.trainer_insta} <br />
                      소개: {item.trainer_intro} <br />
                      체육관 이름: {item.gym_name} <br />
                      체육관 링크: {item.gym_link}
                    </Card.Text>
                    <Button
                      variant="outline-primary"
                      onClick={() => {
                        setTrainer_num(item.trainer_num); 
                        setMember_num("회원 번호 입력"); 
                      }}
                    >
                      선택
                    </Button>
                  </Card.Body>
                </Card>
              ))
            ) : (
              <div>검색 결과가 없습니다.</div>
            )}
          </div>

          <Button variant="dark" type="submit" className={cx('btnPrimary', 'mt3')}>
            등록
          </Button>
          <div className={cx('marginBottom')}></div>
          <Button variant="dark" className={cx('btnPrimaryAbsolute')} as={Link} to="/">
            완료
          </Button>
        </Form>
        <div className={cx('marginBottom')}></div>
      </div>
    </Container>
  );
};

export default TrainerId;
