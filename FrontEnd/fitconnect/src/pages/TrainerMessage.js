import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Row, Col } from "react-bootstrap";
import MessageModal from '../components/TrainerMessageModal';

const Message = () => {
  const [showModal, setShowModal] = useState(false);
  const [members, setMembers] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(''); // 선택된 topic 값을 저장하는 상태

  const getMembers = () => {
    axios.get(`/messenger/list`)
      .then(res => {
        console.log(res.data);
        setMembers(res.data);
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    getMembers();
  }, []);

  useEffect(()=>{
    
  }, [members])

  // 특정 멤버 클릭 시 topic 값을 설정하는 함수
  const handleMemberClick = (topic) => {
    setSelectedTopic(topic); // 클릭한 멤버의 topic 값을 상태로 저장
    setShowModal(true); // 모달을 보여줌
  };

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
                <div className="chatroom">
                  <ul>
                    {members.map(item => (
                      <li key={item.chat_id} onClick={() => handleMemberClick(item.topic)}>
                        {item.profile_image_url && <img src={item.profile_image_url} alt={`${item.name} 프로필`} />}
                        <p>{item.name}</p>
                        <p>프로필 이미지: {item.profile_image_url}</p>
                        <p>내용: {item.content}</p>
                        <p>{item.times}</p>
                      </li>
                    ))}
                  </ul>
                  {/* MessageModal에 topic 값을 전달 */}
                  <MessageModal 
                    showModal={showModal} 
                    setShowModal={setShowModal} 
                    topic={selectedTopic} // 선택된 topic 값을 전달
                  />
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
