import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import ChatMessage from './ChatMessage'; 
import mqtt from 'mqtt';
import { Modal, Button } from 'react-bootstrap';

const MessageModal = ({ showModal, setShowModal }) => {
      // 페이지 전환하면서 useNavigate 로 얻어오는 변수들
  // const location = useLocation();
  // const { member_num, trainer_num, send_type, topic } = location.state;

  const [state, setState] = useState({
    member_num: 1,
    trainer_num: 2,
    send_type: "member",
    topic: "mytopic"
  });

  const [message, setMessage] = useState({
    send_type: state.send_type, 
    content: ""
  });

  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const encoder = new TextEncoder();
  const decoder = new TextDecoder('utf-8');
  const navigate = useNavigate();

  const client = mqtt.connect('ws://localhost:9001'); // mqtt 연결 설정 코드

  const refresh = () => {
    //api 주소
    axios.get("/messenger/list")
      .then(res => {
        console.log(res.data);
        setMessages(res.data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  useEffect(() => {
    refresh();
    client.subscribe(state.topic);
    client.on('message', function (topic, message) {
      const decodedMessage = JSON.parse(decoder.decode(new Uint8Array(message)));
      console.log(decodedMessage);
      setMessages(prevMessages => [...prevMessages, decodedMessage]);
    });

    return () => {
      client.end();
    };
  }, []);

  const sendMessageHandle = (e) => {
    e.preventDefault();
    if (message.content !== "") {
      client.publish(state.topic, JSON.stringify(message), { qos: 0, retain: false });

      axios.post("/messenger/detail", message)
        .then(res => {
          console.log(res.data);
        })
        .catch(error => {
          console.log(error);
        });

      setMessage({
        send_type: state.send_type,
        content: ""
      });
    }
  };

//메세지 종료시 navigate설정
  const ExitHandle = () => {
    setShowModal(false); // Close the modal
    navigate("/tr/message");
  };

  //채팅창 제일 아래로 
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>MQTT Chat</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* 메세지 show */}
        <div style={{ height: '400px', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px' }}>
          {messages.map((msg, index) => (
            <ChatMessage key={index} message={msg.content} isOwnMessage={msg.send_type === state.send_type} />
          ))}
          <div ref={messagesEndRef} />
          {/* 채팅 전송버튼 */}
          <form onSubmit={sendMessageHandle} style={{ display: 'flex', marginTop: '10px' }}>
            <input
              type="text"
              value={message.content}
              onChange={(e) => setMessage({ ...message, content: e.target.value })}
              style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
            <Button type="submit" style={{ padding: '10px', borderRadius: '5px', marginLeft: '10px' }}>Send</Button>
          </form>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={ExitHandle}>
          End
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MessageModal;
