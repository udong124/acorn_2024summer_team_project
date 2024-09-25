package com.fitconnect.service;


import java.util.List;

import com.fitconnect.dto.ChatRoomDto;
import com.fitconnect.dto.MessageDto;

public interface MessageService {
	public void insertChat(ChatRoomDto dto);
	public ChatRoomDto getChatRoom(int member_num);
	public List<ChatRoomDto> getChatRoomAll();
	public List<MessageDto> getMessage(String topic);
	public void sendMessage(MessageDto dto);
	public void deleteMsg(int message_id);
	public void deleteChat(String topic);
	public void deleteTrainerChat(int trainer_num);
}
