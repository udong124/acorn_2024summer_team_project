import axios from "axios";
import { decodeToken } from "jsontokens";
import { useEffect, useRef, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import MemberMessengerModal from "../../components/MemberMessngerModal";
import plusimage from "../../assets/images/users/plusimage.png";

function MemberMessenger() {
  const result = decodeToken(localStorage.token.substring(7));
  const member_num = result.payload.id;

  //트레이너 info 정보
  const [trainerInfo, setTrainerInfo] = useState({
    name: "",
    id: "",
    userName: "",
    email: "",
    regdate: "",
    profile: "",
    trainer_insta: "",
    trainer_intro: "",
    gym_name: "",
    gym_link: "",
  });

  //채팅방 정보
  const [chatRoom, setChatRoom] = useState({});
  //채팅방 모달창 관리
  const [showModal, setShowModal] = useState(false);

  // 프로필 이미지 src 에 적용할 값을 state 로 관리 하기
  const [imageSrc, setImageSrc] = useState(null);

  const personSvg = useRef();
  // 이미지 input 요소의 참조값을 사용하기 위해
  const imageInput = useRef();

  const navigate = useNavigate();

  const dropZoneStyle = {
    minHeight: "250px",
    minWidth: "250px",
    border: "3px solid #cecece",
    borderRadius: "10px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };
  const profileStyle = {
    width: "200px",
    height: "200px",
    border: "1px solid #cecece",
    borderRadius: "50%",
  };
  const profileStyle2 = {
    width: "200px",
    height: "200px",
    border: "1px solid #cecece",
    borderRadius: "50%",
    display: "none",
  };

  // 트레이너 info를 가져오기
  useEffect(() => {
    console.log(member_num);
    axios
      .get(`/member/trainer`)
      .then((res) => {
        console.log(res.data);
        if (res.data) {
          setTrainerInfo(res.data);
          //만일 등록된 프로필 이미지가 있다면
          if (res.data.profile) {
            setImageSrc(`http://52.78.38.12:8080/upload/${res.data.profile}`);
          } else {
            //없다면
            // person svg 이미지를 읽어들여서 data url 로 만든다음 imageSrc 에 반영하기
            // svg 이미지를 2 진 데이터 문자열로 읽어들여서
            const svgString = new XMLSerializer().serializeToString(
              personSvg.current
            );
            // 2진데이터 문자열을 btoa (binary to ascii) 함수를 이용해서 ascii 코드로 변경
            const encodedData = btoa(svgString);
            // 변경된 ascii 코드를 이용해서 dataUrl 을 구성한다
            const dataUrl = "data:image/svg+xml;base64," + encodedData;
            setImageSrc(dataUrl);
            console.log(dataUrl);
          }
        } else {
          setTrainerInfo(null);
        }
      })
      .catch((error) => console.log(error));
    setTrainerInfo(null);
    console.log(member_num);

    axios
      .get(`/messenger`, {
        params: { member_num: member_num },
      })
      .then((res) => {
        console.log(res.data);
        setChatRoom(res.data);
      })
      .catch((error) => console.log(error));
  }, []);

  //대화하기를 눌렀을 때 실행할 함수
  const handleChatClick = () => {
    setShowModal(true); // 모달을 보여줌
  };

  //트레이너 찾기 버튼 눌렀을 때 실행할 함수
  const handleFindTrainer = () => {
    navigate("/member/trainerlist"); //트레이너등록 페이지로 이동
  };

  return (
    <Row>
      <Col>
        <Card>
          <Card.Header>
            <svg
              ref={personSvg}
              style={profileStyle2}
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
              <path
                fillRule="evenodd"
                d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
              />
            </svg>
          </Card.Header>
        </Card>
      </Col>
      <Col>
        <Card>
          <Card.Body>
              {trainerInfo && trainerInfo.name ? (
              // 트레이너 정보가 있을 때
              <>
                <Form.Group>
                  <Form.Control
                    ref={imageInput}
                    style={{ display: "none" }}
                    type="file"
                    name="image"
                    accept="image/*"
                  />
                </Form.Group>
                <div className="mb-3">
                  <div style={dropZoneStyle}>
                    <img style={profileStyle} src={imageSrc} alt="프로필 이미지" />
                  </div>
                </div>
                <div>
                  <Form.Group>
                    <Form.Text>담당 트레이너</Form.Text>
                    <br/>
                    <Form.Label>{trainerInfo.name}</Form.Label>
                  </Form.Group>
                  <Form.Group>
                    <Form.Text>이메일</Form.Text>
                    <br/>
                    <Form.Label>{trainerInfo.email}</Form.Label>
                  </Form.Group>
                  <Form.Group>
                    <Form.Text>SNS</Form.Text>
                    <br/>
                    <Form.Label><a href={trainerInfo.trainer_insta}>인스타그램</a></Form.Label>
                  </Form.Group>
                  <Form.Group>
                    <Form.Text>소갯글</Form.Text>
                    <br/>
                    <Form.Label>{trainerInfo.trainer_intro}</Form.Label>
                  </Form.Group>
                  <Form.Group>
                    <Form.Text>헬스장이름</Form.Text>
                    <br/>
                    <Form.Label>{trainerInfo.gym_name}</Form.Label>
                  </Form.Group>
                  
                  <Form.Group>
                    <Form.Text>헬스장위치</Form.Text>
                    <br/>
                    <Form.Label>{trainerInfo.gym_link}</Form.Label>
                  </Form.Group>
                </div>


                <Button onClick={handleChatClick}>대화시작하기</Button>
              </>
            ) : (
              // 트레이너 정보가 없을 때 '트레이너 찾기' 버튼과 플러스 아이콘이 보이게끔
              <>
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                  <Button
                    variant="light"
                    onClick={handleFindTrainer}
                    style={{ fontSize: "24px" }}
                  >
                    <img
                      src={plusimage}
                      alt="플러스 아이콘"
                      style={{ width: "150px", height: "250px" }}
                    />
                    <p>트레이너 찾기</p>
                  </Button>
                </div>
                <div>
                  <p>트레이너가 아직 등록되지 않았습니다.</p>
                  <p>등록하고 맞춤형 관리를 받아보세요.</p>
                </div>
              </>
            )}
            {/* MessageModal에 topic 값을 전달 */}
            <MemberMessengerModal
              showModal={showModal}
              setShowModal={setShowModal}
              topic={chatRoom.topic} // 선택된 topic 값을 전달
            />
          </Card.Body>
        </Card>
      </Col>
    </Row>


      // <Container
      //   style={{
      //     minHeight: "500px",
      //     display: "flex",
      //     justifyContent: "center",
      //     alignItems: "center",
      //     flexDirection: "column",
      //   }}
      // >
      
      // </Container>
 
  );
}

export default MemberMessenger;
