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
  setTodayEvents([])
  setImageSrc("")
  setTrainerInfo({})
  const todayDate = new Date();
  const events = []; // 결과를 저장할 배열

  const fetchEvents = () => {
    for (let i = 0; i < 4; i++) {
      const currentDate = new Date(todayDate);
      currentDate.setDate(todayDate.getDate() + i); // 오늘부터 i일 후의 날짜 설정
      const formattedDate = formatDate(currentDate); // 포맷팅

      // Axios GET 요청
      axios.get('/trainercalendar', {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      })
        .then(res => {
          // calList가 null이 아닐 때만 filter 수행
          const calList = res.data.calList || []; // 기본값을 빈 배열로 설정
          const filteredEvents = calList.filter(event => 
            event.regdate.startsWith(formattedDate)
          );
          events.push(...filteredEvents); // 결과 배열에 추가

          // 마지막 날짜에 도달했을 때 상태 업데이트
          if (i === 3) {
            setTodayEvents(events);

          }
        })
        .catch(err => console.log(err));
      }
    };
  
    fetchEvents(); // 함수 호출
  

    axios.get(`/user`, {
      headers: {
        Authorization: localStorage.getItem('token')
      }
    })
      .then(res => {
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
        }

        axios.get(`/trainer`, {
          headers: {
            Authorization: localStorage.getItem('token')
          }
        })
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
    fontSize: "20px",
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
    display: "flex",              // Flexbox 사용
    flexDirection: "column",      // 세로 방향으로 배치
    alignItems: "center",         // 수평 가운데 정렬
    justifyContent: "center",     // 수직 가운데 정렬
    overflowY: "auto",  // 세로 스크롤 활성화
    overflowX: "hidden", // 가로 스크롤 비활성화
    maxHeight: "300px",  // 최대 높이 설정 (필요에 따라 조정)

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


  return (
    <div className="home">
      <svg ref={personSvg} style={profileStyle}  xmlns="http://www.w3.org/2000/svg" display="none" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
        <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
      </svg>
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
                          <Card.Body style={eventCardBodyStyle}>
                            {eventsForDate.length > 0 ? (
                            eventsForDate.map(event => (
                              <Row key={event.t_calendar_id} >
                                {event.name} {new Date(event.regdate).toLocaleTimeString()}
                              </Row>
                            ))
                          ) : (
                            
                            <Row>
                              <p>오늘의 일정이 없습니다.</p>
                            </Row>
                          )}
                          </Card.Body>

                        </Card>
                      </Col>
                    );
                  })}
                </Row>
              </Row>
            </Card.Body>
            <Card.Body>
              <Row>
                <Col sm={12} md={12} lg={6}>
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
                    <a href={trainerInfo.trainer_insta} target="_blank" rel="noopener noreferrer"><img
                      src="/img/instagramlogo.png"
                      alt="Instagram Logo"
                      style={{ width: '40px', height: '40px' }} 
                    /></a>
                    </p>
                    <p>
                      {<a href={trainerInfo.gym_link} target="_blank" rel="noopener noreferrer" style={{justifyContent:"center", textAlign:"center", fontWeight:550, textDecoration:"none", color:"#328DF4"}}>
                        {trainerInfo.gym_name}
                      </a>}</p>
                  </Card>
                </Col>

                <Col sm={12} md={12} lg={6}>
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
