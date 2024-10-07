import React from 'react';

const ChatMessage = ({ message, isOwnMessage, isCenter }) => {
  let alignment = 'left'; // 기본값 설정
  let backgroundColor = '#A9F5F2'; // 기본 배경색 설정

  // 가운데 정렬 여부
  if (isCenter) {
    alignment = 'center';
  } else if (isOwnMessage) {
    alignment = 'right';
  }

  // isOwnMessage에 따른 배경색 변경
  if (isOwnMessage) {
    backgroundColor = '#DCF8C6';
  }

  if(isCenter) {
    backgroundColor = '#E9EC69'
  }

  return (
    <div style={{ textAlign: alignment }}>
      <div style={{ 
        display: 'inline-block', 
        padding: '10px', 
        borderRadius: '10px', 
        backgroundColor: backgroundColor, // 설정된 배경색 사용
        maxWidth: '70%',  // 메시지의 최대 너비를 제한하여 중간 정렬 시 자연스럽게 보이게 함
      }}>
        {message}
      </div>
    </div>
  );
};

export default ChatMessage;
