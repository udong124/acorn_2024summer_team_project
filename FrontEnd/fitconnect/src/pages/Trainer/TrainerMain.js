import { Card,Row,Col} from "react-bootstrap";
import { useEffect, useState } from 'react';
import axios from 'axios';
import Message from "./TrainerMessage";

const Home = () => {
  const [todayEvents, setTodayEvents] = useState([]);


  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };


  useEffect(() => {
    const todayDate = getTodayDate();
    axios.get(`/trainercalendar`)
      .then(res => {
        const filteredEvents = res.data.calList.filter(event => 
          event.regdate.startsWith(todayDate) 
        );
        setTodayEvents(filteredEvents);
      })
      .catch(err => console.log(err));
  }, []);



  return (
    <div className="home">
    <Row>
      <Col>
         <Card>
          <Card.Header as="h6" className="border-bottom p-3 mb-0">
            MainPage
          </Card.Header>
          <Card.Body className="">
            <p><b>오늘의 일정</b></p>
          {todayEvents.length > 0 ? (
          todayEvents.map(event => (
            <div key={event.t_calendar_id}>
              <p><b>{event.name}</b></p>
              <p> {event.regdate}</p>
              <hr />
            </div>
          ))
        ) : (
          <p>오늘의 일정이 없습니다. </p>
        )}

        <Message></Message>
          </Card.Body>
        </Card>
      </Col>
    </Row>     
    </div>
  );
};

export default Home;