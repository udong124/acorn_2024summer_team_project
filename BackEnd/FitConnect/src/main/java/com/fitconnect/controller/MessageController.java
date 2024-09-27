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
	
	
	@Operation(summary = "채팅방 생성", description = "회원과 트레이너의 번호를 받아 채팅방 생성")
	@PostMapping("/messenger")
	public Map<String, Object> insertChat(@RequestBody ChatRoomDto dto) {
		
		boolean isSuccess = service.insertChat(dto);
		return Map.of("isSuccess", isSuccess);
		
	}
	
	@Operation(summary = "채팅방 불러오기", description = "특정 채팅방 불러오기")
	@GetMapping("/messenger")
	public ChatRoomDto getChatRoom(@RequestParam int member_num) {
		return service.getChatRoom(member_num);
		
	}
	
	
	@Operation(summary = "(트레이너용)채팅방 목록 불러오기", description = "토큰에 담긴 id 값과 같은 번호를 가지고 있는 채팅방 리스트 가져오기")
	@GetMapping("/messenger/list")
	public List<ChatRoomDto> getChatRoomAll(){
		return service.getChatRoomAll();
	}
	
	
	@Operation(summary = "특정 채팅방 대화 내용 조회", description = "토큰 값을 이용하여 특정 채팅방 내 대화 내용 불러오기")
	@GetMapping("/messenger/detail/{topic}")
	public Map<String, Object> getMessage(@PathVariable("topic") String topic) {
		
		
		return Map.of("msgAll", service.getMessage(topic));
	}
	
	
	@Operation(summary = "메세지 전송", description = "전송된 메세지 DB에 저장하기")
	@PostMapping("/messenger/detail")
	public Map<String, Object> sendMessage(MessageDto dto) {
		boolean isSuccess = service.sendMessage(dto);
		return Map.of("isSuccess", isSuccess);
		
		
	}
	
	
	
	@Operation(summary = "특정 채팅방 내 특정 메세지 삭제", description = "파라미터 값으로 전달받은 메세지 번호를 이용하여 특정 메세지 삭제하기")
	@DeleteMapping("/messenger/detail/{message_id}")
	public Map<String, Object> deleteMsg(@PathVariable("message_id") int message_id) {
		
		boolean isSuccess = service.deleteMsg(message_id);
		return Map.of("isSuccess", isSuccess);
	}
	
	@Operation(summary = "채팅방 삭제(나가기)", description = "특정 회원과 연결된 채팅방 삭제하기(나가기)")
	@DeleteMapping("/messenger/{topic}")
	public Map<String, Object> deleteChat(@PathVariable("topic") String topic ) {
		service.deleteChat(topic);
		return Map.of("isSuccess", true); 
	}
	
	
	
}
