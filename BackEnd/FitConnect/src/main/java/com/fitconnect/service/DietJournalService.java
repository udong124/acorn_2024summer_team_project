package com.fitconnect.service;

import java.util.List;
import java.util.Map;

import com.fitconnect.dto.DietJournalDto;


public interface DietJournalService {
	public List<DietJournalDto> getList(DietJournalDto dto);
	public boolean insert(List<DietJournalDto> dietjournalList);
	public boolean update(DietJournalDto dto);
	public boolean delete(int d_journal_id);
	public boolean deleteAll(int m_calendar_id);
}
