package com.fitconnect.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import com.fitconnect.auth.PrincipalDetails;
import com.fitconnect.dto.DietJournalDto;
import com.fitconnect.dto.UserDto;
import com.fitconnect.repository.DietJournalDao;

class DietJournalServiceTest {

    @Mock
    private DietJournalDao dao;

    @Mock
    private Authentication authentication;

    @Mock
    private PrincipalDetails principalDetails;

    @Mock
    private SecurityContext securityContext;

    @InjectMocks
    private DietJournalServiceImpl service;

    @BeforeEach
    void setUp() {
        // Mock 객체 초기화
        MockitoAnnotations.openMocks(this);
        
        // SecurityContextHolder에 Mock SecurityContext 설정
        SecurityContextHolder.setContext(securityContext);
        
        // Mock SecurityContext 설정
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(principalDetails);
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
    void testGetList() {
        // Given
        DietJournalDto mockDto = new DietJournalDto();
        List<DietJournalDto> mockList = List.of(new DietJournalDto());
        when(dao.getList(any(DietJournalDto.class))).thenReturn(mockList);

        // When
        List<DietJournalDto> result = service.getList(mockDto);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(dao).getList(mockDto); // Mock 객체가 호출되었는지 확인
    }

    @Test
    void testInsert() {
        // Given
        DietJournalDto mockDto1 = new DietJournalDto();
        DietJournalDto mockDto2 = new DietJournalDto();
        List<DietJournalDto> dietJournalList = List.of(mockDto1, mockDto2);

        // When
        service.insert(dietJournalList);

        // Then
        verify(dao, times(2)).insert(any(DietJournalDto.class)); // 2개의 항목이 삽입되었는지 확인
    }

    @Test
    void testUpdate() {
        // Given
        DietJournalDto mockDto = new DietJournalDto();

        // When
        service.update(mockDto);

        // Then
        verify(dao).update(mockDto);
        assertEquals(1, mockDto.getMember_num()); // 사용자 ID가 1로 설정되었는지 확인
    }

    @Test
    void testDelete() {
        // Given
        int d_journal_id = 100;

        // When
        service.delete(d_journal_id);

        // Then
        verify(dao).delete(1, d_journal_id); // 사용자 ID가 1로 설정된 상태에서 삭제 요청 확인
    }

    @Test
    void testDeleteAll() {
        // Given
        int m_calendar_id = 200;

        // When
        service.deleteAll(m_calendar_id);

        // Then
        verify(dao).deleteAll(1, m_calendar_id); // 사용자 ID가 1로 설정된 상태에서 전체 삭제 요청 확인
    }
}
