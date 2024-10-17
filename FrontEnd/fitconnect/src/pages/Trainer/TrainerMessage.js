import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Row, Col, Button, Modal, Form } from "react-bootstrap";
import TrainerMessageModal from '../../components/TrainerMessageModal';
import { useSearchParams } from 'react-router-dom';
import TrainerMessage from './css/TrainerMessage.css'

const Message = () => {
  const [showModal, setShowModal] = useState(false);
  const [members, setMembers] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(); // 선택된 topic 값을 저장하는 상태
  const [isReady, setIsReady] = useState(false);


  // axios.get요청으로 전체 회원리스트 가져오기
  const getMembers = () => {
    axios.get(`/messenger/list`, {
      headers: {
        Authorization: localStorage.getItem('token')
      }
    })
      .then(res => {
        const updatedMembers = res.data.map(item => ({
          ...item,
          name: item.name || '표시할 이름이 없습니다',
          profile: item.profile || '표시할 이미지가 없습니다',
          content: item.content || '표시할 내용이 없습니다',
          times: item.times || '표시할 시간이 없습니다'
        }));
        console.log("가져온데이터", res.data)
        setMembers(updatedMembers);
      })
      .catch(err => console.log(err));
  };
  // search param 을 읽어오기 위한 hook 
  const [params, setParams] = useSearchParams()
  useEffect(() => {
    getMembers();
    // ?topic=xxx   에서 xxx 문자열 읽어오기 
    const topic = params.get("selectedTopic")
    // 만일 존재한다면 
    if (topic) {
      handleMemberClick(topic)
    }
  }, [params]);

  // 특정 멤버 클릭 시 topic 값을 설정하는 함수
  const handleMemberClick = (topic) => {
    setSelectedTopic(topic); // 클릭한 멤버의 topic 값을 상태로 저장
    setIsReady(true); // 모달을 보여줌
  };
  useEffect(() => {
  
    if (isReady && selectedTopic !== "") {
      setShowModal(true); // 모달을 보여줌
      setParams({ selectedTopic })
    }
  }, [selectedTopic])


  // 모달창을 닫았을때 ?topic=xxx  지우기 
  useEffect(() => {
   
    if (isReady && showModal === false ) {
      setParams({})
      setSelectedTopic("")
    }
  }, [showModal])


  const profileStyle = {
    border: `1px solid #ccc`,
    margin: "24px",
    width: "170px",
    height: "170px",
    borderRadius: "50%",
    objectFit: "cover",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
  };

  // 날짜 변환 함수: 'YYYY-MM-DD HH:mm' 형식으로 변환
  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  // Topic별 가장 최근 내용을 가진 객체로 변환
  const latestMessages = members.reduce((acc, item) => {
    if (!item.topic) return acc;

    // 이미 해당 topic이 존재하는 경우, 시간을 비교하여 업데이트
    if (!acc[item.topic] || new Date(item.times) > new Date(acc[item.topic].times)) {
      acc[item.topic] = item;
    }
    return acc;
  }, {});



  //topic 값이 같을경우에는 출력하지 않기
  const ownTopic = Object.values(latestMessages)

  return (
    <>
      <div>
        <Row>
          <Col>
            <Card>
              <Card.Header className="Header">
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
                        <div onClick={() => handleMemberClick(item.topic)} style={{ display: 'flex', alignItems: 'center', flex: 1}}>
                          <img src={item.profile ? "http://52.78.38.12:8080/upload/"+item.profile : "/img/none.png"} alt={`${item.name} 프로필`} style={profileStyle} 
                            onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/img/none.png";}} />
                          <div style={{marginLeft: "50px", paddingLeft: "50px", borderLeft: "2px solid #ccc"}}>
                          <p style={{fontSize:28, marginBottom: 20, fontWeight: 550}}>{item.name}</p>
                          <p style={{fontSize:19, marginBottom: 20, fontweight: 300, opacity:0.95}}>{item.content}</p>
                          <p style={{fontSize:13, opacity:0.7}}>{formatDate(item.times)}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  {/* MessageModal에 topic 값을 전달 */}
                  <TrainerMessageModal
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