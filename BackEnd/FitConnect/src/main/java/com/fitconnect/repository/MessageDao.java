package com.fitconnect.repository;

import java.util.List;

import org.springframework.web.bind.annotation.PathVariable;

import com.fitconnect.dto.ChatRoomDto;
import com.fitconnect.dto.MessageDto;

public interface MessageDao {
	public void insertChat(ChatRoomDto dto);
	public ChatRoomDto getChatRoom(int chat_id);
	public List<MessageDto> getMessage(String topic);
	public List<ChatRoomDto> getChatRoomAll(int trainer_num);
	public void sendMessage(MessageDto dto);
	public void deleteMsg(int message_id);
	public void deleteChat(String topic);

	
	
	
}
