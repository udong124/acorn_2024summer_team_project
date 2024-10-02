import React from 'react';

const ChatMessage = ({ message, isOwnMessage }) => {
  return (
    <div style={{ textAlign: isOwnMessage ? 'right' : 'left' }}>
      <div style={{ display: 'inline-block', padding: '10px', borderRadius: '10px', backgroundColor: isOwnMessage ? '#DCF8C6' : '#A9F5F2' }}>
        {message}
      </div>
    </div>
  );
};

export default ChatMessage;