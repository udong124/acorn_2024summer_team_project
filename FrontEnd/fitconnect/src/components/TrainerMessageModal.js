import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import mqtt from 'mqtt';
import { Modal, Button } from 'react-bootstrap';
import ChatMessage from './ChatMessage'; 

const MessageModal = ({ showModal, setShowModal, topic }) => { // props로 topic 값 받음
  const [message, setMessage] = useState({
    send_type: "", 
    content: "",
    topic: ""
  });
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const decoder = new TextDecoder('utf-8');
  const client = mqtt.connect('ws://localhost:9001'); // mqtt 연결 설정 코드

                              // messenger 내에서 필요한 axios 요청 목록들

                              // get `messenger` -> 채팅방 자체만불러오기(빈채팅방)

                              // get `messenger/list` -> 채팅방외부 회원목록 불러오기 **토큰값필요**
                              // get `messenger/detail/{topic}` ->채팅방내부에 있는 대화내용 불러오기

                              // post `messenger/detail` ->메세지 전송
                              // post `/messenger` -> 채팅방 생성

                              // DEL `messenger` -> 채팅방 삭제
                              // DEL `messenger/detail` -> 채팅방내에서 메세지 하나씩 삭제


  const refresh = () => {
    setMessages([])
    // topic을 활용하여 해당 메시지들을 가져옴
    axios.get(`/messenger/detail/${topic}`)
      .then(res => {
        setMessages([...messages, ...res.data.msgAll]);
      })
      .catch(error => {
        console.log(error);
      });
  };

  useEffect(()=>{
    console.log(messages)
  }, [messages])

  useEffect(()=>{
    refresh();
  }, [])

  useEffect(() => {
    if (topic) {
      refresh();
      client.subscribe(topic);
      client.on('message', function (topic, message) {
        const decodedMessage = JSON.parse(decoder.decode(new Uint8Array(message)));
        console.log(decodedMessage);
        setMessages(prevMessages => [...prevMessages, decodedMessage]);
      });

      return () => {
        client.end();
      };
    }
  }, [topic]); // topic이 변경될 때마다 useEffect 실행

  // 양식제출이 일어났을때 실행되는 핸들러
  const sendMessageHandle = (e) => {
    e.preventDefault();
    if (message.content !== "" && message.topic !== "" && message.send_type !== "") {
      client.publish(topic, JSON.stringify(message), { qos: 0, retain: false });
      axios.post("/messenger/detail", message)
        .then(res => {
          console.log(res.data);
        })
        .catch(error => {
          console.log(error);
        });

      setMessage({
        ...message,
        content: ""
      });
    }
  };

  return (
    <Modal show={showModal} onHide={() => {
      setMessages([])
      setShowModal(false)}}>
      <Modal.Header closeButton>
        <Modal.Title>MQTT Chat - {topic}</Modal.Title> {/* topic 표시 */}
      </Modal.Header>
      <Modal.Body>
        <div style={{ height: '400px', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px' }}>
          {messages.map((msg, index) => (
            <div>
              <ChatMessage key={index} message={msg.content} isOwnMessage={msg.send_type === message.send_type}/>
              <li>{}</li>
            </div>
          ))}
          
          <div ref={messagesEndRef} />
          <form onSubmit={sendMessageHandle} style={{ display: 'flex', marginTop: '10px' }}>
            <input
              type="text"
              value={message.content}
              onChange={(e) => setMessage({ ...message, content: e.target.value})}
              style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
            <Button type="submit" style={{ padding: '10px', borderRadius: '5px', marginLeft: '10px' }}>Send</Button>
          </form>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => {
          setMessages([])
          setShowModal(false)}}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MessageModal;
