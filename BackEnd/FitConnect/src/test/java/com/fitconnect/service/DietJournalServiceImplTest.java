package com.fitconnect.service;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import com.fitconnect.dto.DietJournalDto;
import com.fitconnect.repository.DietJournalDao;

public class DietJournalServiceImplTest {

	@InjectMocks private DietJournalService service;
	
	@Mock private DietJournalDao dao;
	
	@BeforeEach
	void setUp() throws Exception {
		
	}

	@Test
	public void getList() {
		//Given
		//When
		//Then
		DietJournalDto dto = new DietJournalDto();
		dto.setMember_num(1);
		
		dao.getList(dto);
		dto.setM_calendar_id(1);
		
	}

}
