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
import com.fitconnect.dto.MemberDto;
import com.fitconnect.dto.TrainerCalendarDto;
import com.fitconnect.dto.UserDto;
import com.fitconnect.repository.MessageDao;
import com.fitconnect.repository.TrainerCalendarDao;
import com.fitconnect.service.TrainerCalendarServiceImpl;

import java.util.Collections; // 컬렉션을 다루기 위한 유틸 클래스
import java.util.List; // List 인터페이스
import java.util.Map; // Map 인터페이스

public class TrainerCalendarServiceTest {

    @Mock
    private TrainerCalendarDao calDao; // TrainerCalendarDao의 모의 객체 생성

    @Mock
    private MessageDao msgDao; // MessageDao의 모의 객체 생성

    @Mock
    private Authentication authentication; // Authentication의 모의 객체 생성

    @InjectMocks
    private TrainerCalendarServiceImpl trainerCalendarService; // TrainerCalendarServiceImpl에 모의 객체를 주입

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this); // Mockito 어노테이션 초기화
        
        // Mock SecurityContext 설정
        SecurityContextHolder.setContext(new SecurityContext() {
			
			@Override
			public void setAuthentication(Authentication authentication) {
				// TODO Auto-generated method stub
				
			}
			
			@Override
			public Authentication getAuthentication() {
				return authentication; // 모의 Authentication 반환
			}
		});
    }
    
    @Test
    public void testSelectCalenList() {
        UserDto userDto = new UserDto(); // 테스트용 UserDto 객체 생성
        userDto.setId(1); // 사용자 ID 설정
        PrincipalDetails principalDetails = new PrincipalDetails(userDto); // PrincipalDetails 객체 생성
        
        when(authentication.getPrincipal()).thenReturn(principalDetails); // 모의 Authentication에서 Principal 반환
        when(calDao.getCalenList(userDto.getId())).thenReturn(Collections.emptyList()); // getCalenList의 모의 동작 설정

        List<TrainerCalendarDto> result = trainerCalendarService.selectCalenList(); // 실제 메소드 호출

        assertNotNull(result); // 결과가 null이 아님을 확인
        assertTrue(result.isEmpty()); // 결과가 비어 있음을 확인
        verify(calDao, times(1)).getCalenList(userDto.getId()); // getCalenList가 정확히 한 번 호출되었는지 확인
    }

    @Test
    public void testSelectCalenderOne() {
        TrainerCalendarDto calendarDto = new TrainerCalendarDto(); // 테스트용 TrainerCalendarDto 객체 생성
        when(calDao.getCalender(1)).thenReturn(calendarDto); // getCalender 메소드의 모의 동작 설정

        TrainerCalendarDto result = trainerCalendarService.selectCalenderOne(1); // 실제 메소드 호출

        assertNotNull(result); // 결과가 null이 아님을 확인
        verify(calDao, times(1)).getCalender(1); // getCalender가 정확히 한 번 호출되었는지 확인
    }

    @Test
    public void testAddSchedule() {
        UserDto userDto = new UserDto(); // 테스트용 UserDto 객체 생성
        userDto.setId(1); // 사용자 ID 설정
        PrincipalDetails principalDetails = new PrincipalDetails(userDto); // PrincipalDetails 객체 생성
        
        when(authentication.getPrincipal()).thenReturn(principalDetails); // 모의 Authentication에서 Principal 반환
        
        TrainerCalendarDto dto = new TrainerCalendarDto(); // 테스트용 TrainerCalendarDto 객체 생성
        dto.setTrainer_num(userDto.getId());
        dto.setMember_num(2);
        when(calDao.insert(dto)).thenReturn(true);
        boolean success = trainerCalendarService.addSchedule(dto); // 실제 메소드 호출

        assertTrue(success); // 결과가 true인지 확인
        verify(calDao, times(1)).insert(dto); // insert가 정확히 한 번 호출되었는지 확인
        assertEquals(userDto.getId(), dto.getTrainer_num()); // dto의 trainer_num이 사용자 ID와 같은지 확인
        
    }

    @Test
    public void testUpdateSchedule() {
        TrainerCalendarDto dto = new TrainerCalendarDto(); // 테스트용 TrainerCalendarDto 객체 생성
        when(calDao.update(dto)).thenReturn(true); // update 메소드의 모의 동작 설정

        boolean result = trainerCalendarService.updateSchedule(dto); // 실제 메소드 호출

        assertTrue(result); // 결과가 true인지 확인
        verify(calDao, times(1)).update(dto); // update가 정확히 한 번 호출되었는지 확인
    }

    @Test
    public void testDeleteSchedule() {
        TrainerCalendarDto dto = new TrainerCalendarDto(); // 테스트용 TrainerCalendarDto 객체 생성
        dto.setT_calendar_id(1); // 일정 ID 설정
        dto.setMember_num(2); // 회원 번호 설정
        when(calDao.delete(dto)).thenReturn(true); // delete 메소드의 모의 동작 설정

        boolean result = trainerCalendarService.deleteSchedule(dto); // 실제 메소드 호출

        assertTrue(result); // 결과가 true인지 확인
        verify(calDao, times(1)).delete(dto); // delete가 정확히 한 번 호출되었는지 확인
    }

    @Test
    public void testSelectMemberOne() {
        MemberDto memberDto = new MemberDto(); // 테스트용 MemberDto 객체 생성
        when(calDao.getMemberOne(1)).thenReturn(memberDto); // getMemberOne 메소드의 모의 동작 설정

        Map<String, Object> result = trainerCalendarService.selectMemberOne(1); // 실제 메소드 호출

        assertNotNull(result); // 결과가 null이 아님을 확인
        assertEquals(memberDto, result.get("dto")); // 결과 맵의 "dto"가 memberDto와 같은지 확인
        verify(calDao, times(1)).getMemberOne(1); // getMemberOne이 정확히 한 번 호출되었는지 확인
    }

    @Test
    public void testSelectMemberList() {
        UserDto userDto = new UserDto(); // 테스트용 UserDto 객체 생성
        userDto.setId(1); // 사용자 ID 설정
        PrincipalDetails principalDetails = new PrincipalDetails(userDto); // PrincipalDetails 객체 생성
        
        when(authentication.getPrincipal()).thenReturn(principalDetails); // 모의 Authentication에서 Principal 반환
        when(calDao.getMemberList(userDto.getId())).thenReturn(Collections.emptyList()); // getMemberList의 모의 동작 설정

        List<MemberDto> result = trainerCalendarService.selectMemberList(); // 실제 메소드 호출

        assertNotNull(result); // 결과가 null이 아님을 확인
        assertTrue(result.isEmpty()); // 결과가 비어 있음을 확인
        verify(calDao, times(1)).getMemberList(userDto.getId()); // getMemberList가 정확히 한 번 호출되었는지 확인
    }

    @Test
    public void testDisconnect() {
        int memberNum = 1; // 테스트할 회원 번호
        ChatRoomDto chatDto = new ChatRoomDto(); // 테스트용 ChatRoomDto 객체 생성
        chatDto.setTopic("test-topic");
        when(msgDao.getChatRoom(memberNum)).thenReturn(chatDto); // getChatRoom 메소드의 모의 동작 설정
        when(calDao.disconnect(memberNum)).thenReturn(true); // disconnect 메소드의 모의 동작 설정

        boolean result = trainerCalendarService.disconnect(memberNum); // 실제 메소드 호출

        assertTrue(result); // 결과가 true인지 확인
        verify(msgDao, times(1)).deleteChat("test-topic"); // deleteChat이 정확히 한 번 호출되었는지 확인
        verify(calDao, times(1)).disconnect(memberNum); // disconnect가 정확히 한 번 호출되었는지 확인
    }

}