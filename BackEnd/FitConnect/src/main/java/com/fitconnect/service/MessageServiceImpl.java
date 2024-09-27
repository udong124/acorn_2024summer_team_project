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
	public boolean insertChat(ChatRoomDto dto) {
		boolean isSuccess = dao.insertChat(dto);
		return isSuccess;
	}

	//채팅방 불러오기
	@Override
	public ChatRoomDto getChatRoom(int member_num) {
		
		return dao.getChatRoom(member_num);
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
	public boolean sendMessage(MessageDto dto) {
		
		boolean isSuccess = dao.sendMessage(dto);
		return isSuccess;
		
	}

	//메세지 1개 삭제
	@Override
	public boolean deleteMsg(int message_id) {
		
		boolean isSuccess = dao.deleteMsg(message_id);
		return isSuccess;
	}

	//채팅방 삭제(나가기)
	@Override
	public void deleteChat(String topic) {
		dao.deleteMsgAll(topic);
		dao.deleteChat(topic);
		
	}

	@Override
	public boolean deleteTrainerChat(int trainer_num) {
		
		boolean isSuccess = dao.deleteTrainerChat(trainer_num);
		return isSuccess;
	}
	

	
	
	

}
