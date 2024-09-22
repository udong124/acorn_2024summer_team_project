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
  const [newEvent, setNewEvent] = useState({ member_num: '', trainer_num: '', name: '', date: '' }); // 새로운 이벤트의 정보 
  const [isEditing, setIsEditing] = useState(false); // 편집 모드 여부
  const [currentEventId, setCurrentEventId] = useState(null); // 현재 편집 중인 이벤트의 ID
  const [dateEvents, setDateEvents] = useState([]); //해당 날짜 클릭시 보여줄 이벤트



   useEffect(()=>{
     axios.get(`/trainercalendar`)
     .then(res=>setEvents(res.data))
     .catch(err=>console.log(err))
   }, []);

   const saveEvent = (event) => {
    if (isEditing) {
      // 기본 이벤트 업데이트
      axios.put(`/calendar/${currentEventId}`, event)
        .then(res => {setEvents(events.map(evt => evt.id === currentEventId ? res.data : evt))})
        .catch(err => console.log(err));
    } else {
      // 이벤트 서버에 저장
      axios.post(`/calendar`, event)
        .then(res => {setEvents([...events, res.data])})
        .catch(err => console.log(err));
    }
  };

    // 해당 이벤트 서버에서 삭제
    const deleteEvent = (eventId) => {
      axios.delete(`/calendar/${eventId}`)
        .then(() => {setEvents(events.filter(event => event.id !== eventId))})
        .catch(err => console.log(err));
    };



  // 날짜를 클릭했을때 호출되는 핸들러
  const handleDateClick = (date) => {
    const selectedEvents = events.filter(event => event.date.split('T')[0] === date.dateStr);
    setDateEvents(selectedEvents);
    setShowModal(true); // showModal useState를 true로 만들어 모달창 표시
  };



  // 이벤트를 클릭했을때 호출되는 핸들러
  const handleEventClick = (clickInfo) => {
    const event = clickInfo.event; // 이벤트 클릭시
      setNewEvent({
        member_num: event.extendedProps.member_num,
        trainer_num: event.extendedProps.trainer_num,
        name: event.extendedProps.name,
        date: event.startStr,
      });
    setCurrentEventId(event.id); //현재 선택한 이벤트 ID
    setIsEditing(true); //편집모드 설정
    setShowModal(true); // 모달창 표시
  };


  //이벤트 저장을 눌렀을때 호출되는 핸들러
  const handleSaveEvent = () => {
    const eventToSave = { ...newEvent, id: currentEventId || Date.now().toString() };
    saveEvent(eventToSave);
    setShowModal(false);
    setNewEvent({ member_num: '', trainer_num: '', name: '', date: '' });
  };

   // 이벤트 삭제를 눌렀을때 호출되는 핸들러
   const handleDeleteEvent = (eventId) => {
    deleteEvent(eventId);
    setShowModal(false);
  };


   // 캘린더 플러그인들
  const plugins = [dayGridPlugin, timeGridPlugin, interactionPlugin];


  // 이벤트 표시하는곳을 설정하는 함수
  const renderEventContent = (eventInfo) => {
    return (
      <div>
          {/* <b>{eventInfo.timeText}</b>  */}
          <b>{eventInfo.event.title}</b>
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
          {dateEvents.length > 0 ? (
            <div>
              <h3>오늘의 일정</h3>
              <ul>
              {dateEvents.map(event => (
                  <li key={event.t_calendar_id}>
                    {event.name} - {event.date}
                    <Button variant="danger" onClick={() => handleDeleteEvent(event.t_calendar_id)}>삭제</Button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <Form>
              <Form.Group controlId="formEventTitle">
                <Form.Label>회원 이름</Form.Label>
                <Form.Select
                  value={newEvent.name}
                  onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                >
                  {/* 해당부분 반목문으로 name 출력 */}
                  <option value=""></option>
                </Form.Select>
              </Form.Group>
              <Form.Group controlId="formEventDate">
                <Form.Label>날짜 및 시간</Form.Label>
                <Form.Control
                  type="datetime-local"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          {isEditing && <Button variant="danger" onClick={() => handleDeleteEvent(currentEventId)}>삭제</Button>}
          <Button variant="secondary" onClick={() => setShowModal(false)}>취소</Button>
          <Button variant="primary" onClick={handleSaveEvent}>저장</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Calendar;
