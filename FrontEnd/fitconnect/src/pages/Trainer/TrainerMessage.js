import React from 'react';
import { useState } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import ChatMessage from '../../components/ChatMessage';
import mqtt from 'mqtt';
import MessageModal from '../../components/TrainerMessageModal';
import { Card,Row,Col} from "react-bootstrap";

const Message = () => {
  // 페이지 전환하면서 useNavigate 로 얻어오는 변수들
  // const location = useLocation();
  // const { member_num, trainer_num, send_type, topic } = location.state;
  
  const [showModal, setShowModal] = useState(false);
  
  const [members, setMembers] = useState([])

  const getMembers = () =>{
    axios.get(`/messenger/list`)
    .then(res => {
      console.log(res.data)
      setMembers(res.data)
})
    .catch(err => console.log(err));
};
  

useEffect(() => {
  getMembers()
}, []);

  return (
    <>
      <div>
      <Row>
        <Col>
          <Card>
            <Card.Header as="h6" className="border-bottom p-3 mb-0">
              MQTT Chat
            </Card.Header>
            <Card.Body className="">
              <div className="chatroom" onClick={() => {setShowModal(true)}}>
                <ul>
                {members.map(item => (
                  <li key={item.chat_id}>
                    {item.profile_image_url && <img src={item.profile_image_url} alt={`${item.name} 프로필`} />}
                    <p>{item.name}</p>
                    <p>프로필 이미지: {item.profile_image_url}</p>
                    <p>내용: {item.content}</p>
                    <p>{item.times}</p>
                  </li>
                ))}
              </ul>
                <MessageModal showModal={showModal} setShowModal={setShowModal}/>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>     
      </div>
    </>
  );
};

export default Message;
