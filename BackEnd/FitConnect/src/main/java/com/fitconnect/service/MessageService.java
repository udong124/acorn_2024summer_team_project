package com.fitconnect.service;


import java.util.List;

import com.fitconnect.dto.ChatRoomDto;
import com.fitconnect.dto.MessageDto;

public interface MessageService {
	public boolean insertChat(ChatRoomDto dto);
	public ChatRoomDto getChatRoom(int member_num);
	public List<ChatRoomDto> getChatRoomAll();
	public List<MessageDto> getMessage(String topic);
	public boolean sendMessage(MessageDto dto);
	public boolean deleteMsg(int message_id);
	public void deleteChat(String topic);
	public boolean deleteTrainerChat(int trainer_num);
}
