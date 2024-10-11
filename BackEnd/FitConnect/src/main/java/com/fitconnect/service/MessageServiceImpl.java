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
	/**
	 * <PRE>
	 * 1. MethodName	: insertChat
	 * 2. ClassName		: MessageServiceImpl
	 * 3. Commnet			: 채팅방을 생성하는 메소드
	 * 4. 작성자				: songminjung
	 * 5. 작성일				: 2024. 9. 30. 오후 2:44:01
	 * </PRE>
	 * 		@param dto
	 * 		@return true or false
	 */
	@Override
	public boolean insertChat(ChatRoomDto dto) {
		boolean isSuccess = dao.insertChat(dto);
		return isSuccess;
	}

	//채팅방 불러오기
	/**
	 * <PRE>
	 * 1. MethodName	: getChatRoom
	 * 2. ClassName		: MessageServiceImpl
	 * 3. Commnet			: 특정 채팅방을 불러오는 메소드
	 * 4. 작성자				: songminjung
	 * 5. 작성일				: 2024. 9. 30. 오후 2:44:07
	 * </PRE>
	 * 		@param member_num
	 * 		@return ChatRoomDto
	 */
	@Override
	public ChatRoomDto getChatRoom(int member_num) {
		
		return dao.getChatRoom(member_num);
	}
		
	
	//채팅방 목록(트레이너용)
	/**
	 * <PRE>
	 * 1. MethodName	: getChatRoomAll
	 * 2. ClassName		: MessageServiceImpl
	 * 3. Commnet			: 트레이너의 채팅방 목록을 조회하는 메소드
	 * 4. 작성자				: songminjung
	 * 5. 작성일				: 2024. 9. 30. 오후 2:44:11
	 * </PRE>
	 * 		@return List<ChatRoomDto>
	 */
	@Override
	public List<ChatRoomDto> getChatRoomAll() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		UserDto userDto = ((PrincipalDetails)authentication.getPrincipal()).getDto();
		
		return dao.getChatRoomAll(userDto.getId());
	}
	
	//채팅방 대화 내용 조회
	/**
	 * <PRE>
	 * 1. MethodName	: getMessage
	 * 2. ClassName		: MessageServiceImpl
	 * 3. Commnet			: 특정 채팅방의 대화 목록을 조회하는 메소드
	 * 4. 작성자				: songminjung
	 * 5. 작성일				: 2024. 9. 30. 오후 2:44:14
	 * </PRE>
	 * 		@param topic
	 * 		@return List<MessageDto>
	 */
	@Override
	public List<MessageDto> getMessage(String topic) {
		
		return dao.getMessage(topic);
	}

	//메세지 전송
	/**
	 * <PRE>
	 * 1. MethodName	: sendMessage
	 * 2. ClassName		: MessageServiceImpl
	 * 3. Commnet			: 전송된 메세지를 저장하는 메소드
	 * 4. 작성자				: songminjung
	 * 5. 작성일				: 2024. 9. 30. 오후 2:44:17
	 * </PRE>
	 * 		@param dto
	 * 		@return true or false
	 */
	@Override
	public boolean sendMessage(MessageDto dto) {
		
		boolean isSuccess = dao.sendMessage(dto);
		return isSuccess;
		
	}

	//메세지 1개 삭제
	/**
	 * <PRE>
	 * 1. MethodName	: deleteMsg
	 * 2. ClassName		: MessageServiceImpl
	 * 3. Commnet			: 특정 채팅방 내 특정 메세지 1개를 삭제하는 메소드
	 * 4. 작성자				: songminjung
	 * 5. 작성일				: 2024. 9. 30. 오후 2:44:20
	 * </PRE>
	 * 		@param message_id
	 * 		@return true or false
	 */
	@Override
	public boolean deleteMsg(int message_id) {
		
		boolean isSuccess = dao.deleteMsg(message_id);
		return isSuccess;
	}

	//채팅방 삭제(나가기)
	/**
	 * <PRE>
	 * 1. MethodName	: deleteChat
	 * 2. ClassName		: MessageServiceImpl
	 * 3. Commnet			: 특정 채팅방과 특정 채팅방 내 대화 내용을 삭제하는 메소드
	 * 4. 작성자				: songminjung
	 * 5. 작성일				: 2024. 9. 30. 오후 2:44:22
	 * </PRE>
	 * 		@param topic
	 */
	@Override
	public boolean deleteChat(String topic) {
		boolean isSuccess = false;
		dao.deleteMsgAll(topic);
		if(dao.deleteChat(topic)) {
			isSuccess=true;
		}else {
			isSuccess = false;
		}
		return isSuccess;
		
	}

	/**
	 * <PRE>
	 * 1. MethodName	: deleteTrainerChat
	 * 2. ClassName		: MessageServiceImpl
	 * 3. Commnet			: 특정 트레이너와 연결된 모든 채팅방과 내용을 삭제하는 메소드
	 * 4. 작성자				: songminjung
	 * 5. 작성일				: 2024. 9. 30. 오후 2:44:24
	 * </PRE>
	 * 		@param trainer_num
	 * 		@return true or false
	 */
	@Override
	public boolean deleteTrainerChat(int trainer_num) {
		
		boolean isSuccess = dao.deleteTrainerChat(trainer_num);
		return isSuccess;
	}
	

	
	
	

}
