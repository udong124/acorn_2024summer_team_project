import { Button, Card, Row, Col } from "react-bootstrap";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { useNavigate } from 'react-router-dom';

function MemberCalendar(){
  const navigate = useNavigate()

  const handleDateClick=(e)=>{
    const selectDate = e.dateStr
    localStorage.setItem('selectDate',selectDate)
    navigate('/MemberDietAdd')
  }

  return (
    <div>
        <Row>
        <Col xs={12} md={12} sm={12}>
            <Card>
            <Card.Header as="h6" className="border-bottom p-3 mb-0">
              Calendar
            </Card.Header>
            <Card.Body className="">
                <FullCalendar
                    plugins={[dayGridPlugin]}
                    initialDate={new Date()}
                    initialView="dayGridMonth"
                    navLink={true}
                    navLinkDayClick={function(date,jsEvent){
                      console.log('day',date.toISOString());
                      console.log('coords',jsEvent.pageX, jsEvent.pageY)
                    }}
                />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MemberCalendar;
