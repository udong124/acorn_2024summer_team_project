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
        setCalendarData(res.data);
      })
      .catch(error => console.log(error));
  }, [token]);
  
  useEffect(()=>{
    calendarData.forEach(event => {
      if(event.memo != null) {
        const mcalendarEvent = {
          id: event.m_calendar_id.toString(),
          title: event.memo,
          start: event.regdate,
          member_num: event.member_num,
          m_calendar_id: event.m_calendar_id,
          backgroundColor: '#D3D3D3'
        }
        setCalendarEvents([...calendarEvents, mcalendarEvent]);
      }

      if (event.isExistDiet) {
        const dietEvent = {
          id: event.m_calendar_id.toString(),
          title: "식단",
          start: event.regdate,
          member_num: event.member_num,
          m_calendar_id: event.m_calendar_id,
          memberDietDto: event.memberDietDto,
          backgroundColor: '#FFA500'
        }  
        setCalendarEvents([...calendarEvents, dietEvent]);
      }

      if (event.isExistExercise) {
        const exerciseEvent = {
          id: event.m_calendar_id.toString(),
          title: "운동",
          start: event.regdate,
          member_num: event.member_num,
          m_calendar_id: event.m_calendar_id,
          memberExerciseDto: event.memberExerciseDto,
          backgroundColor: '#00BFFF'
        }  
        setCalendarEvents([...calendarEvents, exerciseEvent]);
      }
    })
  }, [calendarData])

  useEffect(()=>{
    setShowEvents(calendarEvents);
  }, [calendarEvents])

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
    if (clickInfo.event.title === "식단") {
      setSelectedDietDetails(clickInfo.event.memberDietDto);
      setShowModal(true);
    } 
    //운동일때는?
    else if(clickInfo.event.title === "운동") {
      setSelectedExerciseDetails(clickInfo.event.memberExerciseDto);
      setShowModal(true);
    }
    else {
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
                events={showEvents}
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