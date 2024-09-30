// calendar.jsx

import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from '@fullcalendar/daygrid';
import { Modal, Button, Form } from 'react-bootstrap';
import { Card,Row,Col} from "react-bootstrap";
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
// import './css/TrainerCalendar.css';

function Calendar() {
  // 상태 훅을 사용하여 이벤트, 모달 표시 여부, 새 이벤트 정보, 편집 상태, 현재 이벤트 ID를 관리
  const [events, setEvents] = useState([]); // 서버에서 가져온 데이터
  const [showModal, setShowModal] = useState(false); // 모달의 표시 여부
  const [newEvent, setNewEvent] = useState({ t_calendar_id:'', member_num: '', trainer_num: '', name: '', date: '' }); // 새로운 이벤트 의 정보 
  const [isEditing, setIsEditing] = useState(false); // 편집 모드 여부
  const [currentEventId, setCurrentEventId] = useState(null); // 현재 편집 중인 이벤트의 ID
  const [dateEvents, setDateEvents] = useState([]); //해당 날짜 클릭시   보여줄 이벤트



  useEffect(()=>{
    axios.get(`/trainercalendar`)
    .then(res=>{
     const formattedEvents = res.data.calList.map(event =>({
       id: event.t_calendar_id,
       title: event.name,
       start: event.regdate,
       member_num: event.member_num,
       trainer_num: event.trainer_num
     }))
     setDateEvents(formattedEvents)
     setEvents(formattedEvents)})
    .catch(err=>console.log(err))
  }, []);


  



  // 날짜를 클릭했을 때 호출되는 핸들러
  const handleDateClick = (date) => {
    const selectedEvents = events.filter(event => event.start.split('T')[0] === date.dateStr);
    setDateEvents(selectedEvents);
    setShowModal(true);
  };

  // 이벤트를 클릭했을 때 호출되는 핸들러
  const handleEventClick = (date) => {
    const selectedEvents = events.filter(event => event.start.split('T')[0] === date.dateStr);
    setDateEvents(selectedEvents)
    setIsEditing(true);
    setShowModal(true);
  };


    // 이벤트 저장을 눌렀을 때 호출되는 핸들러
    const handleSaveEvent = () => {
      const eventToSave = {
        member_num: newEvent.member_num,
        regdate: newEvent.date
      };
  
      if (isEditing) {
        axios.put(`/trainercalendar/${newEvent.t_calendar_id}`, eventToSave)
          .then(res => {
            console.log("이벤트 업데이트 성공:", res.data);
            console.log(eventToSave)
            const updatedEvent = res.data;
            setEvents(events.map(evt =>
              evt.id === updatedEvent.t_calendar_id
                ? { ...evt, title: updatedEvent.name, start: updatedEvent.regdate }
                : evt
            ));
            setShowModal(false);
          })
          .catch(err => console.log("이벤트 업데이트 실패:", err));
      } else {
        axios.post(`/trainercalendar/${newEvent.t_calendar_id}`, eventToSave)
          .then(res => {
            const newEventFromResponse = res.data;
            setEvents([...events, {
              id: newEventFromResponse.t_calendar_id,
              title: newEventFromResponse.name,
              start: newEventFromResponse.regdate,
              member_num: newEventFromResponse.member_num,
              trainer_num: newEventFromResponse.trainer_num
            }]);
            console.log(eventToSave)
            console.log(res.data)
            setShowModal(false);
          })
          .catch(err => console.log("이벤트 생성 실패:", err));
      }
  
      // 상태 초기화
      setNewEvent({ member_num: '', date: '' });
    };
  
  

    const handleDeleteEvent = (t_calendar_id) => {
      const formData = new FormData();
      formData.append("t_calendar_id", t_calendar_id); // 필요한 데이터 추가

      axios.delete(`/trainercalendar/${t_calendar_id}`, {
        data: formData, // form-data를 data에 넣어 보냅니다.
        headers: {
          "Content-Type": "multipart/form-data", // 헤더에 Content-Type 설정
        },
      })
        .then(() => {
          setEvents(events.filter(event => event.id !== t_calendar_id));
          setShowModal(false);
        })
        .catch(err => console.log("이벤트 삭제 실패:", err));
    };
    


   // 캘린더 플러그인들
  const plugins = [dayGridPlugin, timeGridPlugin, interactionPlugin];


  // 이벤트 표시하는곳을 설정하는 함수
  const renderEventContent = (eventInfo) => { 
    return (
      <div>
          {/* <b>{eventInfo.timeText}</b>  */}
          <b>{eventInfo.event.title} {eventInfo.timeText}</b>
      </div>
    );
  };

  return (
    <div className="fullcalendar-wrapper">
    <Row>
      <Col>
         <Card>
          <Card.Header as="h6" className="border-bottom p-3 mb-0">
              Calendar
          </Card.Header>
          <Card.Body className="">
      {/* 풀캘린더 기능들 */}
      <FullCalendar
        plugins={plugins}
        initialView="dayGridMonth" // 월 달력
        displayEventTime='false'
        events={events} // 이벤트 띄우기
        locale='ko' // 언어
        //headertoolbar 버튼
        headerToolbar={{ 
          left: "dayGridMonth,timeGridWeek,timeGridDay,today", 
          center: "title",
          right: "addEventButton,prev,next"
        }}
        customButtons={{
          addEventButton: {
            text: '+',
            click: () => {
              setNewEvent({ member_num: '', trainer_num: '', name: '', date: '' });
              setIsEditing(false);
              setShowModal(true);
            }
          }
        }}
        buttonText={{
          today: "오늘",
          month: "월별",
          week: "주별",
          day: "일별",
          list: "리스트"
        }}

        dateClick={handleDateClick} 
        eventClick={handleEventClick} 
        eventContent={renderEventContent} // 이벤트 콘텐츠 커스터마이즈 함수 추가
        expandRows={true} // 행 확장을 활성화하여 모든 이벤트 표시
        dayMaxEventRows={false} // 최대 이벤트 행 수를 비활성화
        dayMaxEvents={false} // 최대 이벤트 수를 비활성화
      />
         <Modal show={showModal} onHide={() => setShowModal(false)}>
         <Modal.Header closeButton>
            <Modal.Title>{isEditing ? '일정 수정' : '새 일정 추가'}</Modal.Title>
         </Modal.Header>
         <Modal.Body>
              <Form>
          {/* 회원 번호 선택 */}
              <Form.Group controlId="formEventMemberNum">
                <Form.Label>회원 번호</Form.Label>
                <Form.Select
                  value={newEvent.member_num}
                  onChange={(e) => setNewEvent({ ...newEvent, member_num: e.target.value })} // member_num 설정
                >
                   {Array.isArray(events) && events.map(item => (
                          <option key={uuidv4()} value={item.member_num}>
                            {item.title}
                          </option>
                        ))}
                </Form.Select>
              </Form.Group>

              {/* 날짜 및 시간 선택 */}
              <Form.Group controlId="formEventDate">
                <Form.Label>날짜 및 시간</Form.Label>
                <Form.Control
                  type="datetime-local"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} // date 설정
                />
              </Form.Group>
            </Form>
            </Modal.Body>
        <Modal.Footer>
                {isEditing && <Button variant="danger" onClick={() => handleDeleteEvent(currentEventId)}>삭제</Button>}
                <Button variant="primary" onClick={handleSaveEvent}>저장</Button>
              </Modal.Footer>
            </Modal>
          </Card.Body>
        </Card>
      </Col>
    </Row>    

    </div>
  );
}

export default Calendar;
