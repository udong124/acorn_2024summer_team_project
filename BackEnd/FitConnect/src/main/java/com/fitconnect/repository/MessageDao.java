package com.fitconnect.repository;

import java.util.List;

import org.springframework.web.bind.annotation.PathVariable;

import com.fitconnect.dto.ChatRoomDto;
import com.fitconnect.dto.MessageDto;

public interface MessageDao {
	public boolean insertChat(ChatRoomDto dto);
	public ChatRoomDto getChatRoom(int member_num);
	public List<MessageDto> getMessage(String topic);
	public List<ChatRoomDto> getChatRoomAll(int trainer_num);
	public boolean sendMessage(MessageDto dto);
	public boolean deleteMsg(int message_id);
	public boolean deleteChat(String topic);
	public boolean deleteMsgAll(String topic);
	public boolean deleteTrainerChat(int trainer_num);

	
	
	
}
