import { useEffect, useState } from "react";
import FullCalendar from '@fullcalendar/react';
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from '@fullcalendar/daygrid';
import { Modal, Button, Form } from 'react-bootstrap';
import { Card, Row, Col } from "react-bootstrap";
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

function Calendar() {
  const [events, setEvents] = useState([]); // 캘린더에 표시할 이벤트 목록
  const [members, setMembers] = useState([]); // 회원 목록
  const [showModal, setShowModal] = useState(false); // 새 일정 추가/수정 모달
  const [showDateEventsModal, setShowDateEventsModal] = useState(false); // 날짜 클릭 시 모든 일정 보기 모달
  const [newEvent, setNewEvent] = useState({ t_calendar_id: 0, member_num: 0, date: '' }); // t_calendar_id 추가
  const [isEditing, setIsEditing] = useState(false); // 편집 모드 여부
  const [currentEventId, setCurrentEventId] = useState(null); // 현재 편집 중인 이벤트의 ID
  const [selectedDateEvents, setSelectedDateEvents] = useState([]); // 선택한 날짜의 모든 일정

  //해당 캘린더의 저장되어있는 전체 이벤트를 가져오는 axios.get요청
  const refresh = () => {
    axios.get(`/trainercalendar`)
      .then(res => {
        const formattedEvents = res.data.calList.map(event => ({
          title: event.name,
          start: event.regdate,
          member_num: event.member_num,
          trainer_num: event.trainer_num,
          t_calendar_id: event.t_calendar_id 
        }));
        setEvents(formattedEvents);
      })
      .catch(err => console.log(err));
  };


    const membersList = () => {
      axios.get(`/trainer/list/member`)
        .then(res => {
          setMembers(res.data);
        })
        .catch(err => console.log(err));
    };
  

  useEffect(() => {
    refresh();
    membersList();
  }, []);

  // 날짜 변환 함수: 'YYYY-MM-DD HH:mm' 형식으로 변환
  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  // 이벤트 저장/수정 핸들러
  const saveEvent = (event) => {
    const formattedDate = formatDate(event.date); // 날짜를 변환하여 regdate로 사용
    const eventToSave = {
      regdate: formattedDate,
      member_num: event.member_num,
      t_calendar_id: event.t_calendar_id // t_calendar_id 포함
    };

    if (isEditing) {
      // 기존 저장되어있는 이벤트를 수정하는 axios.put 요청
      axios.put(`/trainercalendar/${event.t_calendar_id}`, eventToSave)
        .then(res => {
          setShowModal(false);
          refresh();
        })
        .catch(err => console.log(err));
    } else {
      // 새로운 이벤트를 추가하는 axios.post요청
      axios.post(`/trainercalendar`, eventToSave)
        .then(res => {
          setShowModal(false);
          refresh();
        })
        .catch(err => console.log(err));
    }
  };

  // ★날짜 클릭 시 호출되는 핸들러
  const handleDateClick = (date) => {
    // 해당 날짜에 저장된 모든 일정을 필터링
    const selectedEvents = events.filter(event => event.start.startsWith(date.dateStr));
    
    // 선택한 날짜의 일정 저장
    setSelectedDateEvents(selectedEvents);

    // 모든 일정 보기 모달을 표시
    setShowDateEventsModal(true);
  };

  // ★이벤트 클릭 시 호출되는 핸들러
  const handleEventClick = (clickInfo) => {
    const event = clickInfo.event;
    setNewEvent({
      t_calendar_id: event.extendedProps.t_calendar_id, // t_calendar_id 포함
      member_num: event.extendedProps.member_num,
      date: event.startStr,
    });
    setCurrentEventId(event.id);
    setIsEditing(true);
    setShowModal(true);
  };

  // 이벤트 저장을 눌렀을 때 호출되는 핸들러
  const handleSaveEvent = () => {
    const eventToSave = {
      t_calendar_id: newEvent.t_calendar_id, // t_calendar_id 추가
      member_num: newEvent.member_num,
      date: newEvent.date, // 변환된 날짜를 date로 설정
    };

    saveEvent(eventToSave); // 저장 호출
    setShowModal(false);
    setNewEvent({ t_calendar_id: 0, member_num: 0, date: '' }); // 상태 초기화
  };

  // 이벤트 삭제 핸들러
  const handleDeleteEvent = () => {
    const { t_calendar_id, member_num } = newEvent; // newEvent에서 t_calendar_id와 member_num 가져오기

    axios.delete(`/trainercalendar/${t_calendar_id}`, { params: { member_num } })
      .then(() => {
        refresh();
        setEvents(events.filter(event => event.id !== t_calendar_id));
        setShowModal(false);
      })
      .catch(err => console.log(err));
  };


  const renderEventContent = (eventInfo) => {
    return (
      <div>
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
                customButtons={{
                  addEventButton: {
                    text: '+',
                    click: () => {
                      setNewEvent({ t_calendar_id: 0, member_num: 0, date: '' });
                      setIsEditing(false);
                      setShowModal(true);
                    }
                  }
                }}
                dateClick={handleDateClick} // 날짜 클릭 시 호출되는 핸들러
                eventClick={handleEventClick} // 이벤트 클릭 시 호출되는 핸들러
                eventContent={renderEventContent}
                expandRows={true} // 행 확장을 활성화하여 모든 이벤트 표시
                dayMaxEventRows={false} // 최대 이벤트 행 수를 비활성화
                dayMaxEvents={false} // 최대 이벤트 수를 비활성화
              />

              {/* 기존 일정 추가/수정 모달 */}
              <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                  <Modal.Title>{isEditing ? '일정 수정' : '새 일정 추가'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Group controlId="formEventMemberNum">
                      <Form.Label>회원 번호</Form.Label>
                      <Form.Select
                        value={newEvent.member_num}
                        onChange={(e) => setNewEvent({ ...newEvent, member_num: e.target.value })}
                      >
                        <option>선택</option>
                        {members.map(item => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
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
                </Modal.Body>
                <Modal.Footer>
                  {isEditing && <Button variant="danger" onClick={handleDeleteEvent}>삭제</Button>}
                  <Button variant="secondary" onClick={() => setShowModal(false)}>취소</Button>
                  <Button variant="primary" onClick={handleSaveEvent}>저장</Button>
                </Modal.Footer>
              </Modal>

              {/* 선택한 날짜의 모든 일정 보기 모달 */}
              <Modal show={showDateEventsModal} onHide={() => setShowDateEventsModal(false)}>
                <Modal.Header closeButton>
                  <Modal.Title>일정</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {selectedDateEvents.length > 0 ? (
                    selectedDateEvents.map(event => (
                      <div key={event.id}>
                        <p><b>{event.title}</b></p>
                        <p>예약시간: {event.start}</p>
                        <hr />
                      </div>
                    ))
                  ) : (
                    <p>해당 날짜에 저장된 일정이 없습니다.</p>
                  )}
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={() => setShowDateEventsModal(false)}>닫기</Button>
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