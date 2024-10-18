import axios from "axios";
import { decodeToken } from "jsontokens";
import { useEffect, useRef, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import MemberMessengerModal from "../../components/MemberMessngerModal";
import searchicon from "../../assets/images/users/searchicon.png";

function MemberMessenger() {


  

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

  const[topicManage, setTopicManage] = useState();
  const [member_num, setMember_num] = useState()


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
    borderRadius: "10px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };
  const profileStyle = {
    maxWidth: "70%",
    border: "1px solid #cecece",
    borderRadius: "50%",
  };
  const profileStyle2 = {
    maxWidth: "70%",
    border: "1px solid #cecece",
    borderRadius: "50%",
    display: "none",
  };

  // 트레이너 info를 가져오기
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

      axios
        .get(`/member/trainer`, {
          headers: {
            Authorization: localStorage.getItem('token')
          }
        })
        .then((res) => {
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
            }
          } else {
            setTrainerInfo(null);
          }
        })
        .catch((error) => console.log(error));
      setTrainerInfo(null);
  }, []);

  useEffect(()=>{
    if(member_num){ //member_num 이 설정되면 실행
      axios
        .get(`/messenger`, {
          params: { member_num: member_num },
        })
        .then((res) => {
          setChatRoom(res.data);
        })
        .catch((error) => console.log(error));
    }
  }, [member_num])
  
  //대화하기를 눌렀을 때 실행할 함수
    // 반복문으로 출력한 id(member_num) 값으로 topic값 가져오기
  const handleChatClick = (member_num) => {
    axios.get(`/messenger`, { params: { member_num } })  
      .then(res => {
        axios.get(`/messenger/detail/${res.data.topic}`)
        .then(detailRes =>{
          //대화 메세지가 있는지 여부
          const isExist = detailRes.data.msgAll.length > 0
          if (!isExist) {
            const firstMessage = {
              topic: res.data.topic,
              content: "채팅방이 개설되었습니다.",
              send_type: "ADMIN",
            };
            setTopicManage(firstMessage)

            // 채팅방 생성 post 요청하기
            axios.post("/messenger/detail", topicManage, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            })
            .then(response => {
              setTopicManage(null)
            })
            .catch(error => {
              console.error(error);
            });
          }else{
            setShowModal(true); // 모달을 보여줌
          }
      })
      .catch(err => {
        console.error( err);
      });
    })
  };


  //트레이너 찾기 버튼 눌렀을 때 실행할 함수
  const handleFindTrainer = () => {
    navigate("/member/trainerlist"); //트레이너등록 페이지로 이동
  };

  return (
    <Row>
      <Col lg={12}>
        <Card>
          <Card.Header as="h6" className="border-bottom p-3 mb-0">
            <p style={{fontSize: "1.5em", fontWeight: "bold"}}>담당 트레이너</p>
          </Card.Header>
        </Card>
            <svg
              ref={personSvg}
              style={profileStyle2}
              xmlns="http://www.w3.org/2000/svg"
              maxWidth="70%"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
              <path
                fillRule="evenodd"
                d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
              />
            </svg>
      </Col>
      <Col>
        <Card >
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
                    <Form.Label><a href={trainerInfo.trainer_insta} target="_blank" rel="noopener noreferrer"><img
                      src="/img/instagramlogo.png"
                      alt="Instagram Logo"
                      style={{ width: '40px', height: '40px' }} 
                    /></a></Form.Label>
                  </Form.Group>
                  <Form.Group>
                    <Form.Text>이메일</Form.Text>
                    <br/>
                    <Form.Label>{trainerInfo.email}</Form.Label>
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
                    <Form.Label><a href={trainerInfo.gym_link}>네이버 지도</a></Form.Label>
                  </Form.Group>
                </div>


                <Button onClick={() => handleChatClick(member_num)}>대화하기</Button>
              </>
            ) : (
              // 트레이너 정보가 없을 때 '트레이너 찾기' 버튼과 검색 아이콘이 보이게끔
              <>
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                  <Button
                    variant="light"
                    onClick={handleFindTrainer}
                    style={{
                      fontSize: "18px",
                      border: "1px solid #007bff", 
                      borderRadius: "8px", 
                      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", 
                      padding: "15px", 
                      cursor: "pointer" 
                    }}
                  >
                    <img
                      src={searchicon}
                      alt="검색 아이콘"
                      style={{ width: "130px", height: "150px" }}
                    />
                    <p>트레이너 찾기</p>
                  </Button>
                </div>
                <div>
                  <p>나만의 트레이너를 찾아 메시지를 보내고, 맞춤형 코칭을 받아보세요!</p>
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
 
  );
}

export default MemberMessenger;
