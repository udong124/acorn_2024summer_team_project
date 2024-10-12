import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import mqtt from 'mqtt';
import { Modal, Button, Form } from 'react-bootstrap';
import ChatMessage from './ChatMessage';

const MessageModal = ({ showModal, setShowModal, topic}) => {
  const [message, setMessage] = useState({
    send_type: "TRAINER",  // 기본값 설정
    content: "",        // 메시지 내용
    topic: topic || ""  // props에서 받은 topic 값
  });
  const [messages, setMessages] = useState([]);
  const [deleteMode, setDeleteMode] = useState(false); // 삭제 모드 상태 추가
  const messagesEndRef = useRef(null);
  const [content, setContent] = useState("");
  const [decodedMessage, setDecodedMessage] = useState("");

  const decoder = new TextDecoder('utf-8');

  const client = mqtt.connect('ws://52.78.38.12:9002'); // mqtt 연결 설정 코드

  const [isReady, setIsReady] = useState(false);
  const [memberName, setMemberName] = useState();

  // 메시지 목록을 새로고침하는 함수
  const refresh = () => {
    setMessages([]); // 기존 메시지 초기화
    if (topic) {
      axios.get(`/messenger/detail/${topic}`)
        .then(res => {
          setMessages(res.data.msgAll); // 서버에서 받은 메시지 데이터로 상태 업데이트
        })
        .catch(error => {
          console.log("Error fetching messages:", error);
        });
    }
  };

  
  //멤버 이름 표시해주는 함수
  const getMemberName = () =>{
    axios.get(`/messenger/list`)
    .then(res =>{
      const member = res.data.find(item => item.topic === topic);
      if(member) {
        setMemberName(member.name)
      } else {
        console.log("멤버이름이 없습니다.")
        }
  })
    .catch(err =>console.log(err))
  }


  useEffect(() => {
    if (topic) {
      client.subscribe(topic); 
      getMemberName();
      client.on('message', (topic, message) => {
        setDecodedMessage(JSON.parse(decoder.decode(new Uint8Array(message))));
      });
    }
  }, [topic]);

  useEffect(()=>{
    if(decodedMessage != "") {
      setMessages(prevMessages => [...prevMessages, decodedMessage]); // 새로운 메시지를 추가
      console.log("디코드메세지",decodedMessage)
      setDecodedMessage("")
    }
  }, [decodedMessage])

  // `topic`이 변경될 때마다 message.topic을 업데이트
  useEffect(() => {
    refresh();
    setMessage(prevMessage => ({
      ...prevMessage,
      topic: topic // topic을 업데이트
    }));
  }, [topic]);

  
  //메세지 전송을 눌렀을때 스크롤 처리
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  // 양식 제출이 일어났을 때 실행되는 핸들러
  const sendMessageHandle = (e) => {
    e.preventDefault();
    setMessage({ ...message, 
      content: content,
      topic: topic,
      times: new Date().toISOString()
    })
    e.target.content.value = "";
  };

  useEffect(()=>{
    if(message.content != "") {
      // 메시지를 전송하기 전에 필드 상태 확인
      console.log("Sending message:", message);
      scrollToBottom();

      // MQTT로 메시지 전송
      client.publish(topic, JSON.stringify(message), { qos: 0, retain: false });

      // 서버로 메시지 저장 요청
      setIsReady(true);
    }
  }, [message.content])

  useEffect(()=>{
    if(message.content !== "" && isReady){
      console.log("여기는 뭐담겼냐",message)
      axios.post("/messenger/detail", message, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then(res => {
          console.log("Message sent successfully:", res.data);
          // setMessages(prevMessages => [...prevMessages, message])
          setIsReady(false);
        
          // 메시지 필드 초기화
          setMessage(prevMessage => ({
            ...prevMessage,
            content: "" // 전송 후 content 초기화
          }));
        })
        .catch(error => {
          console.error("Error sending message:", error);
          if (error.response) {
            console.error("Server Response:", error.response.data);
            console.error("Status Code:", error.response.status);
            console.error("Headers:", error.response.headers);
          } else if (error.request) {
            console.error("No response from server:", error.request);
          } else {
            console.error("Error setting up the request:", error.message);
          }
        });
    }
  }, [message, isReady])

  const handleChange = (e) => {
    setContent(e.target.value);
  }

  // 특정 메시지를 삭제하는 함수
  const deleteMessage = (message_id) => {
    axios.delete(`/messenger/detail/${message_id}`)
      .then(res => {
        refresh(); // 삭제 후 메시지 목록 새로고침
      })
      .catch(err => console.log(err));
  };

  // 삭제 모달을 키는 함수
  const toggleDeleteMode = () => {
    refresh();
    setDeleteMode(prevState => !prevState); 
  };

  
  // 날짜 변환 함수: 'YYYY-MM-DD HH:mm' 형식으로 변환
  const formatDate = (date) => {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${month}-${day} ${hours}:${minutes}`;
  };

  const handleClose = () =>{
    setMessages([]);
    setShowModal(false);
    client.end()
  }

  return (
    <Modal show={showModal} onHide={() => {
      setMessages([]);
      setShowModal(false);
    }}>
      <Modal.Header closeButton={handleClose}>
        <Modal.Title>{memberName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div style={{ height: '400px', lineHeight: 'normal', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px'}}>
          {messages.map((msg, index) => (
            <div style={{flex:1}} key={msg.message_id}>
              <ChatMessage message={msg.content} isOwnMessage={msg.send_type === message.send_type} isCenter={msg.send_type === "ADMIN"} times={msg.times ? formatDate(msg.times) : 'No time available'} />
              {/* 삭제 모드일 때만 삭제 버튼을 보여줌 */}
              {deleteMode && msg.send_type === "TRAINER" && (
                <Button 
                  variant="danger" 
                  onClick={() => deleteMessage(msg.message_id)} 
                  style={{ 
                    fontSize: '10px',   // 작은 글자 크기
                    padding: '2px 8px', // 작고 간결한 패딩
                    marginLeft: '400px',
                    marginTop: '5px',
                    marginBottom : '5px',
                    display: 'block'    // 버튼을 블록 요소로 설정하여 아래에 표시
                  }}>
                  X
                </Button>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* 삭제 모드 토글 버튼 */}
        <Button 
          variant={deleteMode ? "secondary" : "warning"} 
          onClick={toggleDeleteMode} 
          style={{marginTop: '5px' ,marginBottom: '5px', padding:'10px'}}>
          {deleteMode ? "삭제 취소" : "메세지 삭제"}
        </Button>

        <Form onSubmit={sendMessageHandle} style={{ display: 'flex', marginTop: '10px' }}>
          <input
            type="text"
            name="content"
            onChange={handleChange}
            style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
          <Button type="submit" style={{ padding: '10px', borderRadius: '5px', marginLeft: '10px' }}>Send</Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => {handleClose()}}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MessageModal;
