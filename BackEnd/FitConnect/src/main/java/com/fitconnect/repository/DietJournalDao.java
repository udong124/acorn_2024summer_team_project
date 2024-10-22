package com.fitconnect.repository;

import java.util.List;

import com.fitconnect.dto.DietJournalDto;

public interface DietJournalDao {
	
	//등록된 식단일지 목록을 리턴하는 메소드
	public List<DietJournalDto> getList(DietJournalDto dto);
	public boolean insert(DietJournalDto dto);
	public boolean update(DietJournalDto dto);
	public boolean delete(int member_num, int d_journal_id);
	public boolean deleteAll(int member_num, int m_calendar_id);
}
