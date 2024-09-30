package com.fitconnect.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fitconnect.auth.PrincipalDetails;

import com.fitconnect.dto.ChatRoomDto;
import com.fitconnect.dto.MessageDto;
import com.fitconnect.dto.UserDto;

import com.fitconnect.service.MessageService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.RequestParam;


@Tag(name = "Message API", description = "컨트롤러에 대한 설명입니다.")
@RestController
public class MessageController {

	@Autowired private MessageService service;
	
	
	/**********************************************************************
	 * <PRE> * 메소드 정보 *
	 * 1. MethodName	: insertChat
	 * 2. ClassName		: MessageController
	 * 3. 작성자			: songminjung
	 * 4. 작성일			: 2024. 9. 30. 오후 1:21:59
	 * 5. 설명			: 새로운 채팅방을 생성하는 메소드
	 * 					  trainer_num, memeber_num 을 json 형태로 받아와 새로운 채팅방을 생성한다.
	 * </PRE>
	 * 		@return Map<String,Object> "isSuccess", true or false
	 * 		@param dto
	 * 		@return
	**********************************************************************/
	@Operation(summary = "채팅방 생성", description = "회원과 트레이너의 번호를 받아 채팅방 생성")
	@PostMapping("/messenger")
	public Map<String, Object> insertChat(@RequestBody ChatRoomDto dto) {
		
		boolean isSuccess = service.insertChat(dto);
		return Map.of("isSuccess", isSuccess);
		
	}
	
	/**********************************************************************
	 * <PRE> * 메소드 정보 *
	 * 1. MethodName	: getChatRoom
	 * 2. ClassName		: MessageController
	 * 3. 작성자			: songminjung
	 * 4. 작성일			: 2024. 9. 30. 오후 1:22:02
	 * 5. 설명			: 특정 채팅방을 불러오는 메소드
	 * 					  파라미터로 받아온 member_num 을 받아와 해당 회원과 연결된 채팅방을 조회하는 메소드
	 * </PRE>
	 * 		@return ChatRoomDto
	 * 		@param member_num
	 * 		@return 
	**********************************************************************/
	@Operation(summary = "채팅방 불러오기", description = "특정 채팅방 불러오기")
	@GetMapping("/messenger")
	public ChatRoomDto getChatRoom(@RequestParam int member_num) {
		return service.getChatRoom(member_num);
		
	}
	
	
	/**********************************************************************
	 * <PRE> * 메소드 정보 *
	 * 1. MethodName	: getChatRoomAll
	 * 2. ClassName		: MessageController
	 * 3. 작성자			: songminjung
	 * 4. 작성일			: 2024. 9. 30. 오후 1:22:05
	 * 5. 설명			: 트레이너의 채팅방 목록을 불러오는 메소드
	 * 					  토큰에 담긴 트레이너의 정보와 연결된 모든 채팅방을 조회한다.
	 * </PRE>
	 * 		@return List<ChatRoomDto>
	 * 		@return
	**********************************************************************/
	@Operation(summary = "(트레이너용)채팅방 목록 불러오기", description = "토큰에 담긴 id 값과 같은 번호를 가지고 있는 채팅방 리스트 가져오기")
	@GetMapping("/messenger/list")
	public List<ChatRoomDto> getChatRoomAll(){
		return service.getChatRoomAll();
	}
	
	
	/**********************************************************************
	 * <PRE> * 메소드 정보 *
	 * 1. MethodName	: getMessage
	 * 2. ClassName		: MessageController
	 * 3. 작성자			: songminjung
	 * 4. 작성일			: 2024. 9. 30. 오후 1:22:08
	 * 5. 설명			: 특정 채팅방 내 대화 내용를 조회하는 메소드
	 * 					  경로변수로 받아온 topic 값을 이용하여 해당 토픽값의 채팅방 내용을 조회한다.
	 * </PRE>
	 * 		@return Map<String,Object> "msgAll", List<MessagsDto>
	 * 		@param topic
	 * 		@return
	**********************************************************************/
	@Operation(summary = "특정 채팅방 대화 내용 조회", description = "토큰 값을 이용하여 특정 채팅방 내 대화 내용 불러오기")
	@GetMapping("/messenger/detail/{topic}")
	public Map<String, Object> getMessage(@PathVariable("topic") String topic) {
		
		
		return Map.of("msgAll", service.getMessage(topic));
	}
	
	
	/**********************************************************************
	 * <PRE> * 메소드 정보 *
	 * 1. MethodName	: sendMessage
	 * 2. ClassName		: MessageController
	 * 3. 작성자			: songminjung
	 * 4. 작성일			: 2024. 9. 30. 오후 1:22:11
	 * 5. 설명			: 전송된 메세지를 저장하는 메소드
	 * 					  topic, content, send_type(MEMBER or TRAINER) 값을 json 형태로 받아 DB에 저장한다.
	 * </PRE>
	 * 		@return Map<String,Object> "isSuccess", true or false
	 * 		@param dto
	 * 		@return
	**********************************************************************/
	@Operation(summary = "메세지 전송", description = "전송된 메세지 DB에 저장하기")
	@PostMapping("/messenger/detail")
	public Map<String, Object> sendMessage(@RequestBody MessageDto dto) {
		boolean isSuccess = service.sendMessage(dto);
		return Map.of("isSuccess", isSuccess);
		
		
	}
	
	
	
	/**********************************************************************
	 * <PRE> * 메소드 정보 *
	 * 1. MethodName	: deleteMsg
	 * 2. ClassName		: MessageController
	 * 3. 작성자			: songminjung
	 * 4. 작성일			: 2024. 9. 30. 오후 1:22:13
	 * 5. 설명			: 특정 채팅방 내 특정 메세지를 삭제하는 메소드
	 * 					  경로변수로 받은 message_id 값을 이용하여 특정 채팅방 내에 있는 특정 메세지 1개를 삭제한다.
	 * </PRE>
	 * 		@return Map<String,Object> "isSuccess", true or false
	 * 		@param message_id
	 * 		@return
	**********************************************************************/
	@Operation(summary = "특정 채팅방 내 특정 메세지 삭제", description = "파라미터 값으로 전달받은 메세지 번호를 이용하여 특정 메세지 삭제하기")
	@DeleteMapping("/messenger/detail/{message_id}")
	public Map<String, Object> deleteMsg(@PathVariable("message_id") int message_id) {
		
		boolean isSuccess = service.deleteMsg(message_id);
		return Map.of("isSuccess", isSuccess);
	}
	
	/**********************************************************************
	 * <PRE> * 메소드 정보 *
	 * 1. MethodName	: deleteChat
	 * 2. ClassName		: MessageController
	 * 3. 작성자			: songminjung
	 * 4. 작성일			: 2024. 9. 30. 오후 1:22:16
	 * 5. 설명			: 특정 채팅방을 삭제하는 메소드
	 * 					  경로변수로 받아온 topic 값을 이용하여 특정 채팅방과 내용을 삭제한다.
	 * </PRE>
	 * 		@return Map<String,Object> "isSuccess", true or false
	 * 		@param topic
	 * 		@return
	**********************************************************************/
	@Operation(summary = "채팅방 삭제(나가기)", description = "특정 회원과 연결된 채팅방 삭제하기(나가기)")
	@DeleteMapping("/messenger/{topic}")
	public Map<String, Object> deleteChat(@PathVariable("topic") String topic ) {
		boolean isSuccess = service.deleteChat(topic);
		return Map.of("isSuccess", isSuccess); 
	}
	
	
	
}
