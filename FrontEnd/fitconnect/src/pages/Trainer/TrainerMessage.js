import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Row, Col, Button, Modal } from "react-bootstrap";
import MessageModal from '../../components/TrainerMessageModal';

const Message = () => {
  const [showModal, setShowModal] = useState(false);
  const [members, setMembers] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(''); // 선택된 topic 값을 저장하는 상태
  const [confirmDelete, setConfirmDelete] = useState(false); // 삭제 확인 모달 상태
  const [topicToDelete, setTopicToDelete] = useState(''); // 삭제할 topic 저장

  // axios.get요청으로 전체 회원리스트 가져오기
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

  // 특정 멤버 클릭 시 topic 값을 설정하는 함수
  const handleMemberClick = (topic) => {
    setSelectedTopic(topic); // 클릭한 멤버의 topic 값을 상태로 저장
    setShowModal(true); // 모달을 보여줌
  };

  // 채팅방에서 나가는 함수 (axios.delete 요청)
  const leaveChatRoom = () => {
    axios.delete(`/messenger/${topicToDelete}`)
      .then(res => {
        console.log(`Left chat room with topic ${topicToDelete}`);
        getMembers(); // 채팅방 목록을 새로고침하여 업데이트
        setConfirmDelete(false); // 모달 닫기
      })
      .catch(err => {
        console.error(`Error leaving chat room with topic ${topicToDelete}:`, err);
      });
  };

  // 삭제 확인 모달을 열기 위한 함수
  const openConfirmDeleteModal = (topic) => {
    setTopicToDelete(topic); // 삭제할 topic 저장
    setConfirmDelete(true); // 삭제 확인 모달 열기
  };

  //topic 값이 같을경우에는 출력하지 않기
  const ownTopic = Array.from(new Map(members.map(item=> [item.topic, item])).values());

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
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {ownTopic.map(item => (
                      <li 
                        key={item.chat_id} 
                        style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center', 
                          borderBottom: '1px solid #ccc', 
                          padding: '10px' 
                        }}
                      >
                        <div onClick={() => handleMemberClick(item.topic)} style={{ flex: 1 }}>
                          {item.profile_image_url && (
                            <img 
                              src={item.profile_image_url} 
                              alt={`${item.name} 프로필`} 
                              style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px' }}
                            />
                          )}
                          <p>{item.name}</p>
                          <p>프로필 이미지: {item.profile_image_url}</p>
                          <p>내용: {item.content}</p>
                          <p>{item.times}</p>
                        </div>
                        {/* 나가기 버튼을 추가 */}
                        <Button 
                          variant="danger" 
                          onClick={() => openConfirmDeleteModal(item.topic)} 
                          style={{ marginLeft: 'auto', fontSize: '14px', padding: '5px 10px' }}
                        >
                          채팅방 삭제
                        </Button>
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

      {/* 삭제 확인 모달 */}
      <Modal show={confirmDelete} onHide={() => setConfirmDelete(false)}>
        <Modal.Header closeButton>
          <Modal.Title>경고</Modal.Title>
        </Modal.Header>
        <Modal.Body>해당 채팅방을 삭제하시겠습니까? </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setConfirmDelete(false)}>
            취소
          </Button>
          <Button variant="danger" onClick={leaveChatRoom}>
            확인
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Message;
