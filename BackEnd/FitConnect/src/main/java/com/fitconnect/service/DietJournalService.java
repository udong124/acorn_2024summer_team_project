package com.fitconnect.service;

import java.util.List;
import java.util.Map;

import com.fitconnect.dto.DietJournalDto;


public interface DietJournalService {
	public List<DietJournalDto> getList(DietJournalDto dto);
	public void insert(List<DietJournalDto> dietjournalList);
	public void update(DietJournalDto dto);
	public void delete(int d_journal_id);
	public void deleteAll(int m_calendar_id);
}
