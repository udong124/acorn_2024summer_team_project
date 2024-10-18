package com.fitconnect.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import com.fitconnect.auth.PrincipalDetails;
import com.fitconnect.dto.UserDto;
import com.fitconnect.dto.memberCalendarDto;
import com.fitconnect.repository.memberCalendarDao;

class memberCalendarServiceTest {

    @Mock
    private memberCalendarDao dao;

    @Mock
    private Authentication authentication;

    @Mock
    private PrincipalDetails principalDetails;

    @Mock
    private SecurityContext securityContext;

    @InjectMocks
    private memberCalendarServiceImpl service;

    @BeforeEach
    void setUp() {
        // Mock 객체 초기화
        MockitoAnnotations.openMocks(this);
        
        // SecurityContextHolder에 Mock SecurityContext를 설정
        SecurityContextHolder.setContext(securityContext);

        // Authentication 객체의 Mock 설정
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(principalDetails);
        // UserDto는 PrincipalDetails에 있는 객체
        when(principalDetails.getDto()).thenReturn(new UserDto(1, 
        														"test", 
        														"1234", 
        														"1234", 
        														"test", 
        														"test@xxx.com", 
        														"USER", 
        														"USER", 
        														"2024-09-39", 
        														null, 
        														"test", 
        														"test"));
    }

    @Test
    void testGetAll() {
        // Given
        List<memberCalendarDto> mockList = List.of(new memberCalendarDto());
        when(dao.getList(anyInt())).thenReturn(mockList);

        // When
        List<memberCalendarDto> result = service.getAll();

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(dao).getList(1); // 사용자가 1로 설정되었기 때문에 확인
    }

    @Test
    void testGetOne() {
        // Given
        memberCalendarDto mockDto = new memberCalendarDto();
        when(dao.getData(any(memberCalendarDto.class))).thenReturn(mockDto);

        // When
        Map<String, Object> result = service.getOne(mockDto);

        // Then
        assertNotNull(result);
        assertEquals(mockDto, result.get("dto"));
        verify(dao).getData(any(memberCalendarDto.class));
    }

    @Test
    void testInsert() {
        // Given
        memberCalendarDto mockDto = new memberCalendarDto();

        // When
        service.insert(mockDto);

        // Then
        verify(dao).insert(mockDto);
        assertEquals(1, mockDto.getMember_num()); // 사용자 ID가 1로 설정되었는지 확인
    }

    @Test
    void testUpdate() {
        // Given
        memberCalendarDto mockDto = new memberCalendarDto();

        // When
        service.update(mockDto);

        // Then
        verify(dao).update(mockDto);
        assertEquals(1, mockDto.getMember_num()); // 사용자 ID가 1로 설정되었는지 확인
    }

    @Test
    void testDelete() {
        // Given
        int m_calendar_id = 100;

        // When
        service.delete(m_calendar_id);

        // Then
        verify(dao).delete(1, m_calendar_id); // 사용자가 1로 설정되었고, 해당 ID로 삭제 요청 확인
    }
}
