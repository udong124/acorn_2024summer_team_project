import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import mqtt from 'mqtt';
import { Modal, Button, Form } from 'react-bootstrap';
import ChatMessage from './ChatMessage';

const MessageModal = ({ showModal, setShowModal, topic }) => {
  const [message, setMessage] = useState({
    send_type: "TRAINER",  // 기본값 설정
    content: "",        // 메시지 내용
    topic: topic || ""  // props에서 받은 topic 값
  });
  const [messages, setMessages] = useState([]);
  const [deleteMode, setDeleteMode] = useState(false); // 삭제 모드 상태 추가
  const messagesEndRef = useRef(null);
  const [content, setContent] = useState("");
  const decoder = new TextDecoder('utf-8');

  const client = mqtt.connect('ws://52.78.38.12:9002'); // mqtt 연결 설정 코드

  const [isReady, setIsReady] = useState(false);

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

  

  useEffect(() => {
    if (topic) {
      client.subscribe(topic); 

      client.on('message', (topic, message) => {
        const decodedMessage = JSON.parse(decoder.decode(new Uint8Array(message)));
        setMessages(prevMessages => [...prevMessages, decodedMessage]); // 새로운 메시지를 추가
      });

      return () => {
        client.end(); // 컴포넌트 언마운트 시 MQTT 연결 해제
      };
    }
  }, [topic]);

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
    setMessage({ ...message, content: content })
    // 메시지를 전송하기 전에 필드 상태 확인
    console.log("Sending message:", message);
    scrollToBottom();
    // 모든 필드가 채워져 있는지 확인

      // MQTT로 메시지 전송
      client.publish(topic, JSON.stringify(message), { qos: 0, retain: false });

      // 서버로 메시지 저장 요청
      setIsReady(true);
      client.end();
  };

  useEffect(()=>{
    if(message.content !== "" && isReady){
      console.log(message)
      axios.post("/messenger/detail", message, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then(res => {
          console.log("Message sent successfully:", res.data);
          refresh(); // 메시지 전송 후 새로고침
          setIsReady(false);
        
          // 메시지 필드 초기화
          setMessage({
            send_type: "TRAINER",  // send_type 유지
            content: "",        // 전송 후 content만 초기화
            topic: topic        // topic 유지
          });
          setContent("")
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
  }, [])

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
    setDeleteMode(prevState => !prevState); 
  };

  return (
    <Modal show={showModal} onHide={() => {
      setMessages([]);
      setShowModal(false);
    }}>
      <Modal.Header closeButton>
        <Modal.Title>{topic}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div style={{ height: '400px', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px' }}>
          {messages.map((msg, index) => (
            <div key={msg.message_id}>
              <ChatMessage message={msg.content} isOwnMessage={msg.send_type === message.send_type} isCenter={msg.send_type === "ADMIN"}/>

              {/* 삭제 모드일 때만 삭제 버튼을 보여줌 */}
              {deleteMode && (
                <Button 
                  variant="danger" 
                  onClick={() => deleteMessage(msg.message_id)} 
                  style={{ fontSize: '12px',  }}>
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
        <Button variant="secondary" onClick={() => {
          setMessages([]);
          setShowModal(false);
        }}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MessageModal;

