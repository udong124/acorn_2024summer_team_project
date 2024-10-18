package com.fitconnect.service;

import static org.mockito.Mockito.*; // Mockito의 정적 메소드 임포트
import static org.junit.jupiter.api.Assertions.*; // JUnit의 단언 메소드 임포트

import org.junit.jupiter.api.BeforeEach; // 테스트 전 메소드를 지정하기 위한 어노테이션
import org.junit.jupiter.api.Test; // 테스트 메소드를 지정하기 위한 어노테이션
import org.mockito.InjectMocks; // 모의 객체가 주입될 클래스에 대한 어노테이션
import org.mockito.Mock; // 모의 객체를 생성하기 위한 어노테이션
import org.mockito.MockitoAnnotations; // Mockito 어노테이션 초기화를 위한 클래스
import org.springframework.security.core.Authentication; // Spring Security의 인증 정보를 담는 인터페이스
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder; // 보안 컨텍스트를 관리하는 클래스

import com.fitconnect.auth.PrincipalDetails;
import com.fitconnect.dto.ChatRoomDto;
import com.fitconnect.dto.MessageDto;
import com.fitconnect.dto.UserDto;
import com.fitconnect.repository.MessageDao;
import com.fitconnect.service.MessageServiceImpl;

import java.util.Collections; // 컬렉션을 다루기 위한 유틸 클래스
import java.util.List; // List 인터페이스

public class MessageServiceTest {

    @Mock
    private MessageDao dao; // MessageDao의 모의 객체 생성

    @Mock
    private Authentication authentication; // Authentication의 모의 객체 생성

    @InjectMocks
    private MessageServiceImpl messageService; // MessageServiceImpl에 모의 객체를 주입

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this); // Mockito 어노테이션 초기화
        
        // Mock SecurityContext 설정
        SecurityContextHolder.setContext(new SecurityContext() {
			
			@Override
			public void setAuthentication(Authentication authentication) {
				
				
			}
			
			@Override
			public Authentication getAuthentication() {
				return authentication; // 모의 Authentication 반환
			}
		});
    }

    @Test
    public void testInsertChat() {
        ChatRoomDto chatRoomDto = new ChatRoomDto(); // 테스트용 ChatRoomDto 객체 생성
        when(dao.insertChat(chatRoomDto)).thenReturn(true); // insertChat 메소드의 모의 동작 설정

        boolean result = messageService.insertChat(chatRoomDto); // 실제 메소드 호출

        assertTrue(result); // 결과가 true인지 확인
        verify(dao, times(1)).insertChat(chatRoomDto); // insertChat이 정확히 한 번 호출되었는지 확인
    }

    @Test
    public void testGetChatRoom() {
        int memberNum = 1; // 테스트에 사용할 회원 번호
        ChatRoomDto chatRoomDto = new ChatRoomDto(); // 테스트용 ChatRoomDto 객체 생성
        when(dao.getChatRoom(memberNum)).thenReturn(chatRoomDto); // getChatRoom 메소드의 모의 동작 설정

        ChatRoomDto result = messageService.getChatRoom(memberNum); // 실제 메소드 호출

        assertNotNull(result); // 결과가 null이 아님을 확인
        verify(dao, times(1)).getChatRoom(memberNum); // getChatRoom이 정확히 한 번 호출되었는지 확인
    }

    @Test
    public void testGetChatRoomAll() {
        UserDto userDto = new UserDto(); // 테스트용 UserDto 객체 생성
        userDto.setId(1); // 사용자 ID 설정
        PrincipalDetails principalDetails = new PrincipalDetails(userDto); // PrincipalDetails 객체 생성
        
        when(authentication.getPrincipal()).thenReturn(principalDetails); // 모의 Authentication에서 Principal 반환
        when(dao.getChatRoomAll(userDto.getId())).thenReturn(Collections.emptyList()); // getChatRoomAll의 모의 동작 설정

        List<ChatRoomDto> result = messageService.getChatRoomAll(); // 실제 메소드 호출

        assertNotNull(result); // 결과가 null이 아님을 확인
        assertTrue(result.isEmpty()); // 결과가 비어 있음을 확인
        verify(dao, times(1)).getChatRoomAll(userDto.getId()); // getChatRoomAll이 정확히 한 번 호출되었는지 확인
    }

    @Test
    public void testGetMessage() {
        String topic = "test-topic"; // 테스트할 주제
        List<MessageDto> messageList = Collections.emptyList(); // 비어 있는 메시지 리스트
        when(dao.getMessage(topic)).thenReturn(messageList); // getMessage 메소드의 모의 동작 설정

        List<MessageDto> result = messageService.getMessage(topic); // 실제 메소드 호출

        assertNotNull(result); // 결과가 null이 아님을 확인
        assertTrue(result.isEmpty()); // 결과가 비어 있음을 확인
        verify(dao, times(1)).getMessage(topic); // getMessage가 정확히 한 번 호출되었는지 확인
    }

    @Test
    public void testSendMessage() {
        MessageDto messageDto = new MessageDto(); // 테스트용 MessageDto 객체 생성
        when(dao.sendMessage(messageDto)).thenReturn(true); // sendMessage 메소드의 모의 동작 설정

        boolean result = messageService.sendMessage(messageDto); // 실제 메소드 호출

        assertTrue(result); // 결과가 true인지 확인
        verify(dao, times(1)).sendMessage(messageDto); // sendMessage가 정확히 한 번 호출되었는지 확인
    }

    @Test
    public void testDeleteMsg() {
        int messageId = 1; // 삭제할 메시지 ID
        when(dao.deleteMsg(messageId)).thenReturn(true); // deleteMsg 메소드의 모의 동작 설정

        boolean result = messageService.deleteMsg(messageId); // 실제 메소드 호출

        assertTrue(result); // 결과가 true인지 확인
        verify(dao, times(1)).deleteMsg(messageId); // deleteMsg가 정확히 한 번 호출되었는지 확인
    }

    @Test
    public void testDeleteChat() {
        String topic = "test-topic"; // 삭제할 채팅방의 주제
        
        // 삭제 동작을 모의 설정
        doNothing().when(dao).deleteMsgAll(topic); // deleteMsgAll에 대한 모의 동작
        doNothing().when(dao).deleteChat(topic); // deleteChat에 대한 모의 동작

        messageService.deleteChat(topic); // 실제 메소드 호출

        verify(dao, times(1)).deleteMsgAll(topic); // deleteMsgAll이 정확히 한 번 호출되었는지 확인
        verify(dao, times(1)).deleteChat(topic); // deleteChat이 정확히 한 번 호출되었는지 확인
    }

    @Test
    public void testDeleteTrainerChat() {
        int trainerNum = 1; // 삭제할 트레이너 번호
        when(dao.deleteTrainerChat(trainerNum)).thenReturn(true); // deleteTrainerChat 메소드의 모의 동작 설정

        boolean result = messageService.deleteTrainerChat(trainerNum); // 실제 메소드 호출

        assertTrue(result); // 결과가 true인지 확인
        verify(dao, times(1)).deleteTrainerChat(trainerNum); // deleteTrainerChat이 정확히 한 번 호출되었는지 확인
    }
}
