import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from "@fullcalendar/timegrid";
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
  const [selectedDietDetails, setSelectedDietDetails] = useState(); // 받아온 식단 값을 저장하는 state
  const [selectedExerciseDetails, setSelectedExerciseDetails] = useState(); // 받아온 운동값을 저장하는 state

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
          m_calendar_id: event.m_calendar_id,
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

    //식단일떄는?
  if (clickInfo.event.title === '식단') {
    const m_calendar_id = clickInfo.event.extendedProps.m_calendar_id; 
    console.log(m_calendar_id)

    axios.get(`/dietjournal/${m_calendar_id}`) 
      .then(res => {
        console.log(res.data.list)
        setSelectedDietDetails(res.data.list);  
        setShowModal(true);
      })
      .catch(err => {
        console.error(err);
      });
  } 
   //운동일때는?
  else if(clickInfo.event.title === '운동') {
    const m_calendar_id = clickInfo.event.extendedProps.m_calendar_id; 
    console.log(m_calendar_id)

    axios.get(`/exercisejournal/${m_calendar_id}`) 
      .then(res => {
        console.log(res.data.exerJournalList); 
        setSelectedExerciseDetails(res.data.exerJournalList);  
        
        setShowModal(true);
      })
      .catch(err => {
        console.error(err);
      });
  } else {
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

  const renderEventContent = (eventInfo) => {
    return (
      <div>
        <b style={{marginLeft: '10px', fontSize: '15px'}}>{eventInfo.event.title}</b>
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
                events={events}
                locale="ko"
                headerToolbar={{
                  left: "dayGridMonth,timeGridWeek,timeGridDay,today",
                  center: "title",
                  right: "addEventButton,prev,next"
                }}
               
                dateClick={handleDateClick} // 날짜 클릭 시 호출되는 핸들러
                eventClick={handleEventClick} // 이벤트 클릭 시 호출되는 핸들러
                eventContent={renderEventContent}
                expandRows={true} // 행 확장을 활성화하여 모든 이벤트 표시
                dayMaxEventRows={false} // 최대 이벤트 행 수를 비활성화
                dayMaxEvents={false} // 최대 이벤트 수를 비활성화
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
        <Modal.Title>
      {selectedDietDetails
        ? "식단 정보 확인"
        : selectedExerciseDetails
        ? "운동 정보 확인"
        : "메모 추가/수정"}
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

       {/* 식단 출력 */}
      {selectedDietDetails && Array.isArray(selectedDietDetails) && selectedDietDetails.length > 0 && (
        <div>
          <h4><b>오늘의 식단 정보<Button style={{marginLeft: '150px', backgroundColor:'#FFA500', border:'none'}} onClick={()=>navigate(`/member/dietjournal`)}>수정하기</Button></b></h4><br/>
          {selectedDietDetails.map((diet, index) => (
            <div key={index} style={{ 
              marginBottom: '15px',
              padding: '15px',
              borderRadius: '10px',
              backgroundColor: '#f8f9fa',
              borderLeft: '5px solid #FFA500',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
             }}>

              <p style={{fontSize:'18px'}}><strong>{diet.diet_type}</strong></p>
              <p><strong>{diet.food} {diet.foodCount}개</strong></p>
              <p style={{ margin: '5px 0', fontSize: '16px'}}><strong>칼로리 -</strong> {diet.calories}kcal</p>
              <p style={{ margin: '5px 0', fontSize: '16px'}}><strong>탄수화물 -</strong> {diet.carbs}g</p>
              <p style={{ margin: '5px 0', fontSize: '16px'}}><strong>단백질 -</strong> {diet.protein}g</p>
              <p style={{ margin: '5px 0', fontSize: '16px'}}><strong>지방 -</strong> {diet.fat}g</p>
            </div>
          ))}
        </div>
      )}

       {/* 운동 출력 */}
    {selectedExerciseDetails && Array.isArray(selectedExerciseDetails) && selectedExerciseDetails.length > 0 && (
      <div>
        <h4><b>오늘의 운동리스트<Button style={{marginLeft: '150px'}} onClick={()=>navigate(`/member/exercise`)}>수정하기</Button></b></h4><br/>
        {selectedExerciseDetails.map((exercise, index) => (
          <div key={index} style={{
            marginBottom: '15px',
            padding: '15px',
            borderRadius: '10px',
            backgroundColor: '#f8f9fa',
            borderLeft: '5px solid #00BFFF',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          }}>
            <h3 style={{
              color: '#343a40',
              fontSize: '18px',
              fontWeight: 'bold',
              marginBottom: '10px',
            }}>{exercise.exercise_name}</h3>
            
            <p style={{ margin: '5px 0', fontSize: '16px'}}>
              <strong>세트 수:</strong> {exercise.exercise_set}
            </p>
            <p style={{ margin: '5px 0', fontSize: '16px'}}>
              <strong>횟수:</strong> {exercise.exercise_count}
            </p>
            <p style={{ margin: '5px 0', fontSize: '16px'}}>
              <strong>순서:</strong> {exercise.exercise_order}
            </p>
            <p style={{ margin: '5px 0', fontSize: '16px'}}>
              <strong>운동 중량:</strong> {exercise.exercise_weight}
            </p>
          </div>
        ))}
      </div>
    )}


          </Form>
        </Modal.Body>
          <Modal.Footer>
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