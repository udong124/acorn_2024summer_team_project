import React from 'react';
import { useState } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import ChatMessage from './ChatMessage'; 
import mqtt from 'mqtt';
import Message from '../pages/TrainerMessage';
import { Modal } from 'react-bootstrap';

const MessageModal = () => {
  // 페이지 전환하면서 useNavigate 로 얻어오는 변수들
  // const location = useLocation();
  // const { member_num, trainer_num, send_type, topic } = location.state;

  const [state, setState] = useState({
    member_num: 1,
    trainer_num: 2,
    send_type: "member", //보내는 사람 type
    topic: "mytopic" //채팅창 고유 번호
  });

  
  const [message, setMessage] = useState({
    send_type: state.send_type, 
    content: ""
  })

  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const encoder = new TextEncoder();
  const decoder = new TextDecoder('utf-8');
  const navigate = useNavigate();

  const client = mqtt.connect('ws://localhost:9001'); //mqtt 연결 설정 코드

  const refresh = ()=>{
    //api 주소?
    axios.get("/message")
    .then(res=>{
        console.log(res.data)
        setMessages(res.data)
    })
    .catch(error=>{
      console.log(error)
    })
  }

  useEffect(() => {
    refresh();
    client.subscribe(state.topic);
    client.on('message', function (topic, message) {
      const decodedMessage = JSON.parse(decoder.decode(new Uint8Array(message)));
      console.log(decodedMessage);
      setMessages((prevMessages) => [...prevMessages, decodedMessage]);
    });
  }, []);

  const sendMessageHandle = (e) => {
    e.preventDefault();
    if(message.content != "") {
      client.publish(state.topic, JSON.stringify(message), { qos: 0, retain: false });

      axios.post("/message", message)
      .then(res=>{
        console.log(res.data)
      })
      .catch(error=>{
        console.log(error)
      })

      setMessage({
        send_type: state.send_type,
        content: ""
      });
    }
  };

  //메세지 종료시 navigate설정
  const ExitHandle = () => {
    client.end();
    navigate("/");
  };

  //채팅창 제일 아래로 
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <>
    <Modal>
      <div>
        <h1>MQTT Chat</h1>
        <div>
          <button onClick={ExitHandle}>end</button>
        </div>
      </div>
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
            onChange={(e) => setMessage({...message, content: e.target.value})}
            style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
          <button type="submit" style={{ padding: '10px', borderRadius: '5px', marginLeft: '10px' }}>send</button>
        </form> 
      </div>
      </Modal>
    </>
  );
};

export default MessageModal;
