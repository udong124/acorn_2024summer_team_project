import { Card, Row, Col, Form } from "react-bootstrap";
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Message from "./TrainerMessage";
import { formatDate } from "fullcalendar/index.js";


const Home = () => {
  const [todayEvents, setTodayEvents] = useState([]);
  // 프로필 이미지 src 에 적용할 값을 state 로 관리 하기
  const [imageSrc, setImageSrc] = useState(null);

  const personSvg = useRef();
  // 이미지 input 요소의 참조값을 사용하기 위해 
  const imageInput = useRef()
  
  const [trainerInfo, setTrainerInfo] = useState({
    name: '',
    id: '',
    userName: '',
    email: '',
    regdate: '',
    profile: '',
    trainer_insta: '',
    trainer_intro: '',
    gym_name: '',
    gym_link: ''
  });


// 날짜 포맷팅 함수
  const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

useEffect(() => {
  const todayDate = new Date();
  const events = []; // 결과를 저장할 배열

  // 4일치 데이터 가져오기
  const fetchEvents = () => {
    for (let i = 0; i < 4; i++) {
      const currentDate = new Date(todayDate);
      currentDate.setDate(todayDate.getDate() + i); // 오늘부터 i일 후의 날짜 설정
      const formattedDate = formatDate(currentDate); // 포맷팅

      // Axios GET 요청
      axios.get('/trainercalendar')
        .then(res => {
          const filteredEvents = res.data.calList.filter(event => 
            event.regdate.startsWith(formattedDate)
          );
          events.push(...filteredEvents); // 결과 배열에 추가

          // 마지막 날짜에 도달했을 때 상태 업데이트
          if (i === 3) {
            setTodayEvents(events);
            console.log(events);
          }
        })
        .catch(err => console.log(err));
    }
  };

  fetchEvents();

    axios.get(`/user`)
      .then(res => {
        setTrainerInfo(null)
        setTrainerInfo(prevInfo => ({
          ...prevInfo,
          ...res.data
        }));
        //만일 등록된 프로필 이미지가 있다면
        if(res.data.profile){
          setImageSrc(`http://52.78.38.12:8080/upload/${res.data.profile}`)
        }else{//없다면 
          // person svg 이미지를 읽어들여서 data url 로 만든다음 imageSrc 에 반영하기 
          // svg 이미지를 2 진 데이터 문자열로 읽어들여서 
          const svgString=new XMLSerializer().serializeToString(personSvg.current)
          // 2진데이터 문자열을 btoa (binary to ascii) 함수를 이용해서 ascii 코드로 변경
          const encodedData = btoa(svgString)
          // 변경된 ascii 코드를 이용해서 dataUrl 을 구성한다 
          const dataUrl = "data:image/svg+xml;base64," + encodedData;
          setImageSrc(dataUrl)
          console.log(dataUrl)
        }

        axios.get(`/trainer`)
          .then(res => { 
            setTrainerInfo(prevInfo => ({
              ...prevInfo,
              ...res.data
            }));
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }, []);

  const dropZoneStyle = {
    minHeight: "250px",
    minWidth: "250px",
    border: "2px solid #ccc",
    borderRadius: "10px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "20px",
    backgroundColor: "#f9f9f9",
  };

  const profileStyle = {
    width: "200px",
    height: "200px",
    borderRadius: "50%",
    objectFit: "cover",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
  };

  const cardHeaderStyle = {
    backgroundColor: "#e6e6e6",
    borderBottom: "2px solid #ccc", // 헤더 아래 구분선
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "16px",
    padding: "10px",
    color: "#333",
    borderTopLeftRadius: "10px",
    borderTopRightRadius: "10px",
  };

  const eventCardStyle = {
    height: "150px",
    marginBottom: "10px",
    backgroundColor: "#ffffff",
    border: "2px solid #bbb", // 일정 카드 외곽선 두께 조정
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  };

  const eventCardBodyStyle = {
    padding: "10px",
    fontSize: "14px",
    color: "#555",
    textAlign: "center",
  };

  const profileCardStyle = {
    padding: "20px",
    border: "2px solid #ccc", // 프로필 카드 외곽선 추가
    borderRadius: "10px",
    backgroundColor: "#ffffff",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  };

  const profileTextStyle = {
    fontSize: "16px",
    color: "#333",
    lineHeight: "1.5",
    marginBottom: "10px",
  };

  const profileLinkStyle = {
    color: "#007bff",
    fontWeight: "bold",
  };

  const pageStyle = {
    padding: "20px",
    backgroundColor: "#f3f3f3",
  };

  return (
    <div className="home" style={pageStyle}>
      <Row>
        <Col lg={12}>
          <Card>
            <Card.Header style={cardHeaderStyle}>
              MainPage
            </Card.Header>
            <Card.Body>
              <p><b>일정</b></p>
              <Row className="m-3">
                <Row>
                  {[...Array(4)].map((_, index) => {
                    const currentDate = new Date();
                    currentDate.setDate(currentDate.getDate() + index);

                    const eventsForDate = todayEvents.filter(event => {
                      const eventDate = new Date(event.regdate);
                      return (
                        eventDate.getFullYear() === currentDate.getFullYear() &&
                        eventDate.getMonth() === currentDate.getMonth() &&
                        eventDate.getDate() === currentDate.getDate()
                      );
                    });

                    return (
                      <Col sm={6} md={6} lg={3} className='leftside' style={{ margin: 0, padding: "10px" }} key={index}>
                        <Card style={eventCardStyle}>
                          <Card.Header style={{ textAlign: "center", fontWeight: "bold", color: "#444" }}>
                            {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월 {currentDate.getDate()}일
                          </Card.Header>
                          {eventsForDate.length > 0 ? (
                            eventsForDate.map(event => (
                              <Card.Body key={event.t_calendar_id} style={eventCardBodyStyle}>
                                {event.name} {new Date(event.regdate).toLocaleTimeString()}
                              </Card.Body>
                            ))
                          ) : (
                            <Card.Body style={eventCardBodyStyle}>
                              <p>오늘의 일정이 없습니다.</p>
                            </Card.Body>
                          )}
                        </Card>
                      </Col>
                    );
                  })}
                </Row>
              </Row>
            </Card.Body>
            <Card.Body>
              <Row>
                <Col sm={12} lg={6}>
                  <Card style={profileCardStyle}>
                    <Form.Group>
                      <Form.Control ref={imageInput} style={{ display: "none" }} type="file" name="image" accept="image/*" />
                    </Form.Group>
                    <div style={dropZoneStyle}>
                      <img style={profileStyle} src={imageSrc} alt="프로필 이미지" />
                    </div>
                    <p style={profileTextStyle}>이름: {trainerInfo.name}</p>
                    <p style={profileTextStyle}>소갯글: {trainerInfo.trainer_intro}</p>
                    <p style={profileTextStyle}>아이디: {trainerInfo.userName}</p>
                    <p style={profileTextStyle}>이메일: {trainerInfo.email}</p>
                    <p style={profileTextStyle}>생성일: {trainerInfo.regdate}</p>
                    <p>
                      <a href={trainerInfo.trainer_insta} target="_blank" rel="noopener noreferrer" style={profileLinkStyle}>
                        트레이너 SNS
                      </a>
                    </p>
                    <p style={profileTextStyle}>헬스장이름: {trainerInfo.gym_name}</p>
                    <p>
                      <a href={trainerInfo.gym_link} target="_blank" rel="noopener noreferrer" style={profileLinkStyle}>
                        헬스장 위치
                      </a>
                    </p>
                  </Card>
                </Col>

                <Col sm={12} lg={6}>
                  <Card style={{ maxHeight: '600px', overflowY: 'auto', overflowX: 'hidden', backgroundColor: '#ffffff', padding: '10px', border: '2px solid #ccc', borderRadius: '10px' }}>
                    <Message />
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
