import { Card,Row,Col, Form} from "react-bootstrap";
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Message from "./TrainerMessage";


const Home = () => {
  const [todayEvents, setTodayEvents] = useState([]);
  // 프로필 이미지 src 에 적용할 값을 state 로 관리 하기
  const [imageSrc, setImageSrc] = useState(null);

  const personSvg = useRef();
  // 이미지 input 요소의 참조값을 사용하기 위해 
  const imageInput = useRef()
  
  const [trainerInfo, setTrainerInfo] = useState({
    name:'',
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

  // 시간 표기 관련 함수
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };


  useEffect(() => {
    const todayDate = getTodayDate();
    axios.get(`/trainercalendar`)
      .then(res => {
        const filteredEvents = res.data.calList.filter(event => 
          event.regdate.startsWith(todayDate) 
        );
        setTodayEvents(filteredEvents);
      })
      .catch(err => console.log(err));

      axios.get(`/user`)
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

  const dropZoneStyle={
    minHeight:"250px",
    minWidth:"250px",
    border:"3px solid #cecece",
    borderRadius:"10px",
    display:"flex",
    justifyContent:"center",
    alignItems:"center"
  }
  const profileStyle={
    width: "200px",
    height: "200px",
    border: "1px solid #cecece",
    borderRadius: "50%"
  }
  const profileStyle2={
    width: "200px",
    height: "200px",
    border: "1px solid #cecece",
    borderRadius: "50%",
    display: "none"
  }


  return (
    <div className="home">
    <Row>
      <Col lg={12}>
         <Card>
          <Card.Header as="h6" className="border-bottom p-3 mb-0">
            MainPage
          </Card.Header>
          <Card.Body >
            <p><b>일정</b></p>
            <Row className="m-3">
              
              {[...Array(4)].map((_, index) => {
                const currentDate = new Date(); // 현재 날짜
                currentDate.setDate(currentDate.getDate() + index); // 인덱스에 따라 날짜를 하루씩 추가

                return (
                  <Col sm={6} md={6} lg={3} className='leftside'  style={{ margin: 0, padding: 0 }} key={index}>
                    {todayEvents.length > 0 ? (
                      todayEvents.map(event => (
                        <Card key={event.t_calendar_id} >
                        <Card.Header>
                          {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월 {currentDate.getDate()}일
                        </Card.Header>
                          <Card.Body style={{ height:"150px" }}>
                            {event.name} {new Date(event.regdate).toLocaleTimeString()}
                          </Card.Body>
                        </Card>
                      ))
                    ) : (
                      <Card>
                        <Card.Header>
                          {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월 {currentDate.getDate()}일
                        </Card.Header>
                        <Card.Body style={{ height:"150px" }}>
                          <p>오늘의 일정이 없습니다.</p>
                        </Card.Body>

                      </Card>
                    )}
                  </Col>
                );
              })}

            </Row>
            </Card.Body>
            <Card.Body>
              <Row>
                <Col sm={12} lg={6} className='leftside'>
                  <Card style={{ maxHeight: '600px', overflowY: 'auto', overflowX: 'hidden' }}>
                    <Message></Message>
                  </Card>

                </Col>
                <Col sm={12} lg={6} className='leftside'>
                  <Card>
                    <Form.Group>
                      <Form.Control ref={imageInput} style={{display:"none"}} type="file" name="image" accept="image/*"/>
                    </Form.Group>
                    <div className="mb-3">
                      <div style={dropZoneStyle}>
                        <img style={profileStyle} src={imageSrc} alt="프로필 이미지"/>
                      </div>
                    </div>

                    <p>이름: {trainerInfo.name}</p>
                    <p>소갯글: {trainerInfo.trainer_intro}</p>
                    <p>아이디: {trainerInfo.userName}</p>
                    <p>이메일: {trainerInfo.email}</p>
                    <p>생성일: {trainerInfo.regdate}</p>
                    <p>
                      {<a href={trainerInfo.trainer_insta} target="_blank" rel="noopener noreferrer">
                        <b>트레이너 SNS</b>
                      </a>}
                    </p>
                    <p>헬스장이름: {trainerInfo.gym_name}</p>
                    <p>
                      {<a href={trainerInfo.gym_link} target="_blank" rel="noopener noreferrer">
                        <b>헬스장 위치</b>
                      </a>}
                    </p>
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