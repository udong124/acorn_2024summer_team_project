import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from '@fullcalendar/interaction';
import { Modal, Button, Card, Row, Col, Form } from "react-bootstrap";
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import MemberCalendar from './css/MemberCalendar.css';

const CalendarComponent = () => {
  // const [m_calendar_id, setMCalendarId]  = useState(null)
  const [calendarData, setCalendarData] = useState([]);
  const [formData, setFormData] = useState({
    m_calendar_id: 0,
    member_num: 0,
    regdate: "",
    memo: "",
    isExistExercise: false,
    isExistDiet: false,
    memberExerciseDto: {},
    memberDietDto: {}
  });
  const [calendarEvents, setCalendarEvents] = useState([]); // 캘린더 보여주는 정보 저장 리스트
  const [showEvents, setShowEvents] = useState([]); // 풀캔린더 보여주는 event
  //////
  const [showModal, setShowModal] = useState(false)
  const [newEventTitle, setNewEventTitle] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [selectedDietDetails, setSelectedDietDetails] = useState(); // 받아온 식단 값을 저장하는 state
  const [selectedExerciseDetails, setSelectedExerciseDetails] = useState(); // 받아온 운동값을 저장하는 state

  const token = localStorage.getItem('token')
  const navigate = useNavigate()

  //시작 시 - 각 날짜 메모, 운동, 식단 가져오기 - 표시
  useEffect(() => {
    axios.get('/membercalendar')
      .then(res => {
        console.log("응답: ")
        console.log(res.data)
        setCalendarData(res.data);
      })
      .catch(error => console.log(error));
  }, [token]);
  
  useEffect(()=>{
    console.log(calendarData)
    calendarData.forEach(event => {
      if(event.memo != null) {
        const mcalendarEvent = {
          id: event.m_calendar_id.toString(),
          title: event.memo,
          start: event.regdate,
          end: event.regdate,
          member_num: event.member_num,
          m_calendar_id: event.m_calendar_id,
          backgroundColor: '#D3D3D3'
        }
        setCalendarEvents((prev) => [...prev, mcalendarEvent]);
      }

      if (event.isExistDiet) {
        const dietEvent = {
          id: event.m_calendar_id.toString(),
          title: "식단",
          start: event.regdate,
          end: event.regdate,
          member_num: event.member_num,
          m_calendar_id: event.m_calendar_id,
          memberDietDto: event.memberDietDto,
          backgroundColor: '#FFA500'
        }  
        setCalendarEvents((prev) => [...prev, dietEvent]);
      }

      if (event.isExistExercise) {
        const exerciseEvent = {
          id: event.m_calendar_id.toString(),
          title: "운동",
          start: event.regdate,
          end: event.regdate,
          member_num: event.member_num,
          m_calendar_id: event.m_calendar_id,
          memberExerciseDto: event.memberExerciseDto,
          backgroundColor: '#00BFFF'
        }  
        setCalendarEvents((prev) => [...prev, exerciseEvent]);
      }
    })
  }, [calendarData])

  useEffect(()=>{
    console.log(calendarEvents);
    setShowEvents(calendarEvents);
  }, [calendarEvents])

  const handleDateClick = (arg) => {
    setSelectedDate(arg.dateStr);
    setNewEventTitle('');
    setSelectedEvent(null);
    setShowModal(true)
  };

  const handleEventClick = (clickInfo) => {
    if (clickInfo.event.title === "식단") {
      navigate(`/member/dietjournal`, {
        state: {
          regdate: clickInfo.event.startStr
        }
      })
    } 
    else if(clickInfo.event.title === "운동") {
      navigate(`/member/exercisejournal`, {
        state: {
          regdate: clickInfo.event.startStr
        }
      })
    }
    else if (clickInfo.event.title !== null) {
          // 메모를 상태에 저장
          setNewEventTitle(clickInfo.event.title);
          setSelectedEvent(clickInfo.event);
          setShowModal(true);
       
      }
    
    }

  const handleClose = () => {
    setShowModal(false);
    setNewEventTitle('');
    setSelectedEvent(null);
    window.location.reload();
  };

  const handleSaveEvent = () => {
    if (newEventTitle.trim()) {
      if (selectedEvent) {
        axios.put(`/membercalendar/${selectedEvent.id}`, {
          m_calendar_id: selectedEvent.id,
          memo: newEventTitle,
        })
          .then(res => {
            res.data.m_calendar_id = selectedEvent.id
            if (res.data.m_calendar_id) {
              const updatedEvents = showEvents.map(event =>
                event.id === selectedEvent.id ? { ...event, title: newEventTitle } : event
              );
              setShowEvents(updatedEvents);
              handleClose();
            }
          })
          .catch(error => {
            console.log(error);
            alert("수정 에러");
          });
      } else {
        const newEvent = {
          memo: newEventTitle,
          regdate: selectedDate,
        };
        axios.post('/membercalendar', newEvent)
          .then((res) => {
            if (res.data.isSuccess) { 
              setShowEvents([...showEvents, { ...newEvent, id: uuidv4(), title: newEventTitle, date: selectedDate }]);
              handleClose();
            }
          })
          .catch(error => {
            console.log(error);
            alert("저장 에러");
          });
      }
    }
  };

  const handleDeleteEvent = () => {
    if (selectedEvent && selectedEvent.id) {
      axios.delete(`/membercalendar/${selectedEvent.id}`) 
        .then((res) => {
          if (res.data.isSuccess) { 
            handleClose();
          }
        })
        .catch(error => {
          console.log(error);
          alert("삭제 중 오류가 발생했습니다: " + error.message);
        });
    }
  };

  const renderEventContent = (eventInfo) => {
    return (
      <div>
        <b>{eventInfo.event.title}</b>
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
            <Card.Body>
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={showEvents}
                locale="ko"
                headerToolbar={{
                  left: "dayGridMonth,timeGridWeek,timeGridDay,today",
                  center: "title",
                  right: "prev,next"
                }}
               
                dateClick={handleDateClick} // 날짜 클릭 시 호출되는 핸들러
                eventClick={handleEventClick} // 이벤트 클릭 시 호출되는 핸들러
                eventContent={renderEventContent}
                expandRows={true} // 행 확장을 활성화하여 모든 이벤트 표시
                dayMaxEventRows={true} // 최대 이벤트 행 수를 비활성화
                dayMaxEvents={false} // 최대 이벤트 수를 비활성화
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            "메모 추가/수정"
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form>
      {/* 메모 입력 부분은 식단 및 운동 정보가 없을 때만 표시 */}
      {!selectedDietDetails && !selectedExerciseDetails && (
        <Form.Group controlId="formEventTitle">
          <Form.Label>메모</Form.Label>
          <Form.Control
            type="text"
            placeholder="메모 입력"
            value={newEventTitle}
            onChange={(e) => setNewEventTitle(e.target.value)}
          />
        </Form.Group>
      )}

      </Form>
        </Modal.Body>
          <Modal.Footer>
          {!selectedDietDetails && (
            <Button variant='info' onClick={
              ()=>navigate(`/member/dietadd`, {
                state: {
                  regdate: selectedDate
                }
              })}>식단 추가</Button>
          )}
          {!selectedExerciseDetails && (
            <Button variant='info' onClick={
              ()=>navigate(`/member/exerciseadd`, {
                state: {
                  regdate: selectedDate
                }
              })}>운동 추가</Button>
          )}
          {!selectedDietDetails && !selectedExerciseDetails && (
            <Button onClick={handleSaveEvent}>저장</Button>
          )}
          {selectedEvent && (
            <Button variant="danger" onClick={handleDeleteEvent}>삭제</Button>
          )}
          <Button variant="secondary" onClick={handleClose}>닫기</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CalendarComponent;