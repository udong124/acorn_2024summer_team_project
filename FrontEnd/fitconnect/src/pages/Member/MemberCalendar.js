import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Modal, Button, Card, Row, Col, Form } from "react-bootstrap";
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'

const CalendarComponent = () => {
  const [m_calendar_id, setMCalendarId]  = useState(null)
  const [events, setEvents] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [newEventTitle, setNewEventTitle] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedEvent, setSelectedEvent] = useState(null)

  const token = localStorage.getItem('token')
  const navigate = useNavigate()


const fetchCalendarEvents = () => {
  axios.get('/membercalendar')
    .then(res => {
      const calendarEvents = res.data.map(event => {
        let eventColor = '#D3D3D3';

        if (event.memo.includes("식단")) {
          eventColor = '#FFA500';
        } else if (event.memo.includes("운동")) {
          eventColor = '#00BFFF';
        }

        return {
          id: event.m_calendar_id.toString(),
          title: event.memo.includes("식단") ? "식단" : event.memo.includes("운동") ? "운동" : event.memo,
          date: event.regdate,
          backgroundColor: eventColor,
          regdate: event.regdate
        };
      });
      setEvents(calendarEvents);
    })
    .catch(error => console.log(error));
};

  useEffect(() => {
    fetchCalendarEvents();
  }, [token]);
  

  useEffect(() => {
    if (m_calendar_id) {
      axios.get(`/membercalendar/${m_calendar_id}`)
        .then(res => {
          const calendar = res.data;
          const fetchedEvents = calendar.map(event => ({
            id: event.m_calendar_id.toString(),
            title: event.memo,
            date: event.regdate,
            regdate: event.regdate,
          }));
          setEvents(fetchedEvents);
        })
        .catch(error => {
          console.error("에러발생", error);
        });
    }
  }, [m_calendar_id])

  
  const handleDateClick = (arg) => {
    setSelectedDate(arg.dateStr);
    setNewEventTitle('');
    setSelectedEvent(null);
    setShowModal(true)
  };

  const handleEventClick = (clickInfo) => {
    const id = clickInfo.event.id;
    const eventDate = clickInfo.event.startStr.split('T')[0];
    setSelectedDate(clickInfo.event.startStr);
    setNewEventTitle(clickInfo.event.title);
    setSelectedEvent(clickInfo.event);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setNewEventTitle('');
    setSelectedEvent(null);
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
              const updatedEvents = events.map(event =>
                event.id === selectedEvent.id ? { ...event, title: newEventTitle } : event
              );
              setEvents(updatedEvents);
              handleClose();
              fetchCalendarEvents();
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
              setEvents([...events, { ...newEvent, id: uuidv4(), title: newEventTitle, date: selectedDate }]);
              handleClose();
              fetchCalendarEvents();
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
            fetchCalendarEvents();  
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