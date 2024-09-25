package com.fitconnect.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import com.fitconnect.auth.PrincipalDetails;
import com.fitconnect.dto.ChatRoomDto;
import com.fitconnect.dto.MessageDto;
import com.fitconnect.dto.UserDto;
import com.fitconnect.repository.MessageDao;
import com.nimbusds.jose.shaded.gson.Gson;
import com.nimbusds.jose.shaded.gson.JsonObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class MessageServiceImpl implements MessageService {

	@Autowired private MessageDao dao;

	//채팅방 생성
	@Override
	public void insertChat(ChatRoomDto dto) {
		//문자열+chat_id 로 topic 생성해서 dto 에 담기
		String topic = ("chat_"+dto.getChat_id());
		dto.setTopic(topic);
		dao.insertChat(dto);

	}

	//채팅방 불러오기
	@Override
	public ChatRoomDto getChatRoom(int member_num) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		UserDto userDto = ((PrincipalDetails)authentication.getPrincipal()).getDto();
		int user_id = userDto.getId();
		ChatRoomDto dto = dao.getChatRoom(user_id);
		return dto;
	}
		
	
	//채팅방 목록(트레이너용)
	@Override
	public List<ChatRoomDto> getChatRoomAll() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		UserDto userDto = ((PrincipalDetails)authentication.getPrincipal()).getDto();
		
		return dao.getChatRoomAll(userDto.getId());
	}
	
	//채팅방 대화 내용 조회
	@Override
	public List<MessageDto> getMessage(String topic) {
		
		return dao.getMessage(topic);
	}

	//메세지 전송
	@Override
	public void sendMessage(MessageDto dto) {
		dao.sendMessage(dto);
		
	}

	//메세지 1개 삭제
	@Override
	public void deleteMsg(int message_id) {
		dao.deleteMsg(message_id);
		
	}

	//채팅방 삭제(나가기)
	@Override
	public void deleteChat(String topic) {
		dao.deleteChat(topic);
		
		
	}

	@Override
	public void deleteTrainerChat(int trainer_num) {
		dao.deleteTrainerChat(trainer_num);
		
	}
	

	
	
	

}
