// calendar.jsx

import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from '@fullcalendar/daygrid';
import './css/Calendar.css';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

function Calendar() {
  // 상태 훅을 사용하여 이벤트, 모달 표시 여부, 새 이벤트 정보, 편집 상태, 현재 이벤트 ID를 관리
  const [events, setEvents] = useState([]); // 캘린더에 표시할 이벤트 목록
  const [showModal, setShowModal] = useState(false); // 모달의 표시 여부
  const [newEvent, setNewEvent] = useState({ member_num:'', date:'' }); 
  const [isEditing, setIsEditing] = useState(false); // 편집 모드 여부
  const [currentEventId, setCurrentEventId] = useState(null); // 현재 편집 중인 이벤트의 ID

   useEffect(()=>{
     axios.post('/calendar')
     .then(res=>setNewEvent(res.data))
     .catch(err=>console.log(err))
   }, []);


  // 날짜를 클릭했을때 호출되는 핸들러
  const handleDateClick = (date) => {
    setNewEvent({ member_num:'', date:'' });
    setIsEditing(false); //편집모드 해제
    setShowModal(true); // showModal useState를 true로 만들어 모달창 표시
  };



  // 이벤트를 클릭했을때 호출되는 핸들러
  const handleEventClick = (clickInfo) => {
    const event = clickInfo.event; // 이벤트 클릭스
    setNewEvent({
      member_num: event.member_num, // 회원 목록
      date: event.date, // 이벤트가 일어나는 시간
    });
    setCurrentEventId(event.id); //현재 선택한 이벤트 ID
    setIsEditing(true); //편집모드 설정
    setShowModal(true); // 모달창 표시
  };
  //이벤트 저장을 눌렀을때 호출되는 핸들러
  const handleSaveEvent = () => {
    if (isEditing) {
      setEvents(events.map(event => 
        event.id === currentEventId ? { ...newEvent, id: currentEventId } : event
      ));
    } else {
      setEvents([...events, { ...newEvent, id: Date.now().toString() }]);
    }
    setShowModal(false);
    setNewEvent({ member_num:'', date:'' });
  };

  const plugins = [dayGridPlugin, timeGridPlugin, interactionPlugin]; // 캘린더 플러그인들


  // 이벤트 표시하는곳을 설정하는 함수
  const renderEventContent = (eventInfo) => {
    return (
      <div>
          <b>{eventInfo.timeText}</b>
      </div>
    );
  };

  return (
    <div className="fullcalendar-wrapper">
      {/* 풀캘린더 기능들 */}
      <FullCalendar
        plugins={plugins}
        initialView="dayGridMonth" // 월 달력
        displayEventTime='false'
        events={events} // 이벤트 띄우기
        locale='ko'
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
              setNewEvent({ member_num:'', date:''});
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

      <Modal show={showModal} onHide={() => setShowModal(false)} >
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? '일정 수정' : '새 일정 추가'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formEventTitle">
              <Form.Label>회원목록</Form.Label>
              <Form.Select
                value={newEvent.member_num}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              >
                <option value="">ㅇㅇ</option>
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="formEventStart">
              <Form.Label>시간</Form.Label>
              <Form.Control
                type="datetime-local"
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            취소
          </Button>
          <Button variant="primary" onClick={handleSaveEvent}>
            저장
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Calendar;
