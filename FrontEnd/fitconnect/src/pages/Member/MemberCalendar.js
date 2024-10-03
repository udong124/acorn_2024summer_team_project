import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Modal, Button, Card, Row, Col, Form } from "react-bootstrap";
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'

const CalendarComponent = () => {
  const { m_calendar_id } = useParams()
  const [events, setEvents] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [newEventTitle, setNewEventTitle] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedEvent, setSelectedEvent] = useState(null)

  const token = localStorage.getItem('token')
  const navigate = useNavigate()

  useEffect(() => {
    axios.get('/membercalendar')
      .then(res => {
        const calendarEvents = res.data.map(event => {
          let eventColor = '#D3D3D3'
          
          if (event.memo.includes("식단")) {
            eventColor = '#FFA500'
          } else if (event.memo.includes("운동")) {
            eventColor = '#00BFFF'
          }
          
          return {
            id: event.m_calendar_id.toString(),
            title: event.memo.includes("식단") ? "식단" : event.memo.includes("운동") ? "운동" : event.memo,
            date: event.date,
            backgroundColor: eventColor
          };
        });
        setEvents(calendarEvents);
      })
      .catch(error => console.log(error));
  }, [token]);
  

  useEffect(() => {
    if (m_calendar_id) {  // m_calendar_id가 존재할 때만 API 호출
      axios.get(`/membercalendar/${m_calendar_id}`)
        .then(res => {
          const calendar = res.data;  // 특정 멤버의 캘린더
          const fetchedEvents = calendar.map(event => ({
            id: event.m_calendar_id.toString(),  // ID를 문자열로 변환
            title: event.memo,
            date: event.date,
          }));
          setEvents(fetchedEvents);
        })
        .catch(error => {
          console.error("에러발생", error);
        });
    }
  }, [m_calendar_id])  // m_calendar_id가 변경될 때마다 호출

  
  // 날짜 클릭 시 모달 열기
  const handleDateClick = (arg) => {
    setSelectedDate(arg.dateStr);  // 선택한 날짜 저장
    setNewEventTitle('');  // 새로운 이벤트 추가를 위해 제목 초기화
    setSelectedEvent(null);  // 새로운 이벤트 추가를 위해 기존 이벤트 정보 초기화
    setShowModal(true)
  };

  // 기존 이벤트 클릭 시 모달 열기
  const handleEventClick = (clickInfo) => {
    const eventDate = clickInfo.event.startStr
    if (clickInfo.event.title.includes("식단")){
      navigate(`/MemberDietJournal?date=${eventDate}`)
    }else if (clickInfo.event.title.includes("운동")){
      navigate(`/MemberExerciseJournal?date=${eventDate}`)
    }
    setSelectedDate(clickInfo.event.startStr);  // 이벤트의 날짜 저장
    setNewEventTitle(clickInfo.event.title);  // 기존 이벤트 제목을 입력 필드에 표시
    setSelectedEvent(clickInfo.event);  // 선택된 이벤트 정보를 상태에 저장
    setShowModal(true);
  };

  // 모달 닫기
  const handleClose = () => {
    setShowModal(false);
    setNewEventTitle('');
    setSelectedEvent(null);
  };

  // 이벤트 저장 및 추가
  const handleSaveEvent = () => {
    if (newEventTitle.trim()) {
      if (selectedEvent) {
        //기존 이벤트 수정
        axios.put(`/membercalendar/${m_calendar_id}`, {
          m_calendar_id: selectedEvent.id,
          memo: newEventTitle,
        })
          .then(res => {
            if (res.data.m_calendar_id) {
              const updatedEvents = events.map(event =>
                event.id === selectedEvent.id ? { ...event, title: newEventTitle } : event
              );
              setEvents(updatedEvents);
              handleClose();
            }
          })
          .catch(error => {
            console.log(error);
            alert("수정 에러");
          });
      } else {
        // 새로운 이벤트 추가
        const newEvent = {
          memo: newEventTitle,
          date: selectedDate,
        };
        
        axios.post('/membercalendar', newEvent)
          .then((res) => {
            if (res.data.isSuccess) { 
              setEvents([...events, { ...newEvent, id: uuidv4(), title: newEventTitle, date: selectedDate }]);
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

  // 이벤트 삭제
  const handleDeleteEvent = () => {
    if (selectedEvent && selectedEvent.m_calendar_id) {
      axios.delete(`/membercalendar/${selectedEvent.m_calendar_id}`) 
        .then((res) => {
          if (res.data.isSuccess) { 
            const updatedEvents = events.filter(event => event.m_calendar_id !== selectedEvent.m_calendar_id);
            setEvents(updatedEvents);
            handleClose();
          }
        })
        .catch(error => {
          console.log(error);
          alert("삭제 중 오류가 발생했습니다: " + error.message);
        });
    }
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
              <div>
                <FullCalendar
                  plugins={[dayGridPlugin, interactionPlugin]}
                  initialView="dayGridMonth"
                  events={events}
                  dateClick={handleDateClick}
                  eventClick={handleEventClick}
                  editable={true}
                  selectable={true}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedEvent ? '이벤트 수정' : '일정 추가'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formEventTitle">
              <Form.Label>메모</Form.Label>
              <Form.Control
                type="text"
                placeholder="입력"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
              />
            </Form.Group>
            <p><strong>날짜:</strong> {selectedDate}</p>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {selectedEvent && (
            <Button variant="danger" onClick={handleDeleteEvent}>삭제</Button>
          )}
          <Button variant="primary" onClick={handleSaveEvent}>
            {selectedEvent ? '수정' : '저장'}
          </Button>
          <Button variant="secondary" onClick={handleClose}>닫기</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CalendarComponent;