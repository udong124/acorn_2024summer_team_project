import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Row, Col, Button, Modal, Form } from "react-bootstrap";
import MessageModal from '../../components/TrainerMessageModal';
import { useSearchParams } from 'react-router-dom';


const Message = () => {
  const [showModal, setShowModal] = useState(false);
  const [members, setMembers] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(''); // 선택된 topic 값을 저장하는 상태


  // axios.get요청으로 전체 회원리스트 가져오기
  const getMembers = () => {
    axios.get(`/messenger/list`)
      .then(res => {
        const updatedMembers = res.data.map(item => ({
          ...item,
          name: item.name || '표시할 이름이 없습니다',
          profile: item.profile || '표시할 이미지가 없습니다', 
          content: item.content || '표시할 내용이 없습니다',
          times: item.times || '표시할 시간이 없습니다' 
        }));
        setMembers(updatedMembers);
      })
      .catch(err => console.log(err));
  };
  // search param 을 읽어오기 위한 hook 
  const [params, setParams] = useSearchParams()
  useEffect(() => {
    getMembers();
    console.log(params)
    // ?topic=xxx   에서 xxx 문자열 읽어오기 
    const topic=params.get("topic")
    // 만일 존재한다면 
    if(topic){
      //쳇팅 모달 띄우기
      handleMemberClick(topic)
    }
  }, []);

  // 특정 멤버 클릭 시 topic 값을 설정하는 함수
  const handleMemberClick = (topic) => {
    setSelectedTopic(topic); // 클릭한 멤버의 topic 값을 상태로 저장
    setShowModal(true); // 모달을 보여줌
    setParams({topic})
  };

  // 모달창을 닫았을때 ?topic=xxx  지우기 
  useEffect(()=>{
    if(showModal === false){
      setParams({})
    }
  }, [showModal])


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
                    {ownTopic.filter(item => item.topic !== null).map(item => (
                      <li 
                        key={item.topic} 
                        style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center', 
                          borderBottom: '1px solid #ccc', 
                          padding: '10px' 
                        }}>
                        <div onClick={() => handleMemberClick(item.topic)} style={{ flex: 1 }}>
                          <p>{item.name}</p>
                          <p>프로필 이미지: {item.profile}</p>
                          <p>내용: {item.content}</p> 
                          <p>{item.times}</p>
                        </div>
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