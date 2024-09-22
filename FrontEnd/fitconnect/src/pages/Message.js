import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Message= () => {
  const [members, setMembers] = useState([]); // 서버에서 가져온 회원목록을 저장하는 state
  const [messages, setMessages] = useState([]); // 서버에서 가져온 메세지를 저장하는 state
  const [selectedMembers, setSelectedMembers] = useState(null); // 현재 선택된 회원정보를 저장하는 state
  const [newMessage, setNewMessage] = useState(''); // 사용자가 입력한 새로운 메세지를 저장하는 state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 서버에서 회원 목록과 메시지 목록을 가져오는 함수
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get(`/members`);  
        setMembers(members.data);
        setLoading(false);
      } catch (error) {
        console.error('데이터 로딩에 실패했습니다');
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  useEffect(() => {
    if (selectedMembers) {
      const fetchMessages = async () => {
        try {
          const response = await axios.get(`/messages/${selectedMembers.id}`); 
          setMessages(response.data);
        } catch (error) {
          console.error('데이터 로딩에 실패했습니다');
        }
      };

      fetchMessages();
    }
  }, [selectedMembers]);

  const handleSendMessage = async () => {
    if (newMessage.trim() !== '' && selectedMembers) {
      try {
        await axios.post(`/api/messages/${selectedMembers.id}`, {
          message: newMessage,
          timestamp: new Date().toISOString()
        });
        setMessages([...messages, { message: newMessage, timestamp: new Date().toISOString(), sender: 'me' }]);
        setNewMessage('');
      } catch (error) {
        console.error('데이터 로딩에 실패했습니다');
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
// if (error) {
  //   return <p>{error}</p>;
  // }

  return (
    <div className="messenger">
      <div className="members-list">
        <h2>Message</h2>
        <ul>
          {members.map(member => (
            <li key={member.id} onClick={() => setSelectedMembers(member)}>
              {member.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="message-area">
        {selectedMembers ? (
          <div>
            <h2>{selectedMembers.name}와의 대화</h2>
            <div className="messages">
              {messages.map((msg, index) => (
                <div key={index} className={msg.sender === 'me' ? 'my-message' : 'member-message'}>
                  <p>{msg.message}</p>
                  <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
                </div>
              ))}
            </div>
            <div className="message_input">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="메시지 입력"
              />
              <button onClick={handleSendMessage}>전송</button>
            </div>
          </div>
        ) : (
          <div>.</div>
        )}
      </div>
    </div>
  );
};

export default Message;