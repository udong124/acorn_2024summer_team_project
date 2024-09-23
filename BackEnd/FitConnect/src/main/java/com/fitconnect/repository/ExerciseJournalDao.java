package com.fitconnect.repository;

import java.util.List;
import java.util.Map;

import com.fitconnect.dto.ExerciseJournalDto;

public interface ExerciseJournalDao {
	
	public List<ExerciseJournalDto> getExerJournalList(int m_calendar_id);
	public ExerciseJournalDto getExer(int e_journal_id);
	
	public boolean insert(ExerciseJournalDto dto);
	
	public boolean update(ExerciseJournalDto dto);
	public boolean delete(ExerciseJournalDto dto);
	public boolean deleteAll(int m_calendar_id);
}
