import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Form, Button, Card, Row, Col, Container } from "react-bootstrap"; // Bootstrap 적용

import { decodeToken } from "jsontokens";
import { useNavigate } from "react-router-dom";

const TrainerId = () => {
  const searchKeywordRef = useRef(""); // 검색어 Ref
  const [searchCondition, setSearchCondition] = useState("gym_name"); // 검색 조건
  const [trainerList, setTrainerList] = useState([]); // 전체 트레이너 목록
  const [filteredTrainers, setFilteredTrainers] = useState([]); // 필터링된 트레이너 목록
  const [selectedTrainer, setSelectedTrainer] = useState(null); // 선택한 트레이너
  const [member_num, setMember_num] = useState(null); // 회원 번호 상태

  const navigate = useNavigate();

  //트레이너리스트를 가져오기
  useEffect(() => {
    axios
      .get("/trainer/list")
      .then((response) => {
        const trainerData = response.data;
        setTrainerList(trainerData);
        setFilteredTrainers(trainerData);
      })
      .catch((error) => {
        console.error("트레이너 목록 조회 실패:", error);
      });
  }, []);

  // 로그인한 "Bearer+"뒤의 토큰 부분에서 id 가져오기
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && token.startsWith("Bearer+")) {
      try {
        const { payload } = decodeToken(token.substring(7));
        if (payload && payload.id) {
          setMember_num(payload.id); // 토큰에서 가져온 id를 member_num으로 설정
        } else {
          console.error("토큰에 id 정보가 없습니다.");
        }
      } catch (error) {
        console.error("토큰 처리 중 오류:", error);
      }
    }
  }, []);

  // 검색어 변경에 따라 필터링
  const handleSearch = () => {
    const keyword = searchKeywordRef.current.value.trim().toLowerCase();
    if (!keyword) {
      setFilteredTrainers(trainerList);
      return;
    }
    //검색어조건(헬스장이름, 트레이너인스타에 따라)
    const filteredList = trainerList.filter((trainer) => {
      if (searchCondition === "gym_name") {
        return trainer.gym_name.toLowerCase().includes(keyword);
      } else if (searchCondition === "trainer_insta") {
        return trainer.trainer_insta.toLowerCase().includes(keyword);
      }
      return false;
    });

    setFilteredTrainers(filteredList);
  };

  const handleRegister = () => {
    if (!selectedTrainer || !member_num) {
      alert("트레이너와 회원 정보를 확인하세요.");
      return;
    }
    //현재 해결되지 못한 부분-> 선택된 트레이너 등록(axios.patch안됨) 못함, member_num 을 얻어오지 못함(회원번호에 나온 번호는 user_num이다)
    axios
      .patch("/member/update/trainer", {
        member_num: member_num,
        trainer_num: selectedTrainer.trainer_num,
      })
      .then((response) => {
        if (response.data.isSuccess) {
          alert("트레이너가 성공적으로 등록되었습니다.");
          setSelectedTrainer(null);
          setFilteredTrainers(trainerList);
          navigate("/member/mypagedetail")
        } else {
          alert("트레이너 등록에 실패했습니다.");
        }
      })
      .catch((error) => {
        console.error("트레이너 등록 실패:", error);
      });
  };

  return (
    <Container>
      <Row>
        <Col>
          <Card>
            <Card.Header as="div" className="border-bottom p-3 mb-0">
              <h4>트레이너 등록</h4>
            </Card.Header>
            <Card.Body className="">
              <Form className="mb-3">
                <Row>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Select
                        value={searchCondition}
                        onChange={(e) => setSearchCondition(e.target.value)}
                      >
                        <option value="gym_name">헬스장 이름</option>
                        <option value="trainer_insta">
                          트레이너 인스타그램
                        </option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Control
                        type="text"
                        placeholder="검색어를 입력하세요"
                        ref={searchKeywordRef}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={2}>
                    <Button onClick={handleSearch} className="w-100">
                      검색
                    </Button>
                  </Col>
                </Row>
              </Form>

              {/* 선택된 트레이너 정보와 회원 번호 입력 */}
              {selectedTrainer && (
                <div className="mt-4">
                  <h4>선택된 트레이너</h4>
                  <p>이름: {selectedTrainer.name}</p>
                  <p>헬스장: {selectedTrainer.gym_name}</p>
                  <p>인스타그램: {selectedTrainer.trainer_insta}</p>
                  <p>회원 번호: {member_num ? member_num : "토큰에서 member_num을 찾을 수 없음..."}</p>
                  <Button
                    onClick={handleRegister}
                    className="btn-primary w-100"
                  >
                    등록
                  </Button>
                </div>
              )}

              {/* 검색된 트레이너 목록을 가로로 보여주기 */}
              <Row className="mt-3">
                {filteredTrainers.length > 0 ? (
                  filteredTrainers.map((trainer) => (
                    <Col
                      xs={12}
                      md={12}
                      className="mb-3"
                      key={trainer.trainer_num}
                    >
                      <Card
                        className="h-100 shadow-sm"
                        style={{ width: "100%" }}
                      >
                        <Card.Body>
                          <Card.Title>{trainer.gym_name}</Card.Title>
                          <Card.Text>{trainer.trainer_insta}</Card.Text>
                          <Button
                            onClick={() => setSelectedTrainer(trainer)}
                            className="w-100 btn-secondary"
                          >
                            선택
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))
                ) : (
                  <Col>
                    <p>검색된 트레이너가 없습니다.</p>
                  </Col>
                )}
              </Row>

            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TrainerId;
