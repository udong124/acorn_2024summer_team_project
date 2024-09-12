package com.fitconnect.trainer.service;


import java.util.List;
import java.util.Map;

import com.fitconnect.trainer.dto.ExerciseJournalDto;
import com.fitconnect.trainer.dto.ExerciseListDto;
import com.fitconnect.trainer.repository.ExerciseListDao;

public interface ExerciseService {

	
	public List<ExerciseJournalDto> SelectJournalAll(int m_calendar_id);
	public ExerciseJournalDto selectExerJournalOne(int e_journal_id);
	
	public boolean addExercise(List<ExerciseJournalDto> exerJournalList);
	
	public boolean deleteExer(ExerciseJournalDto dto);
	public boolean deleteExerAll(int m_calendar_id);
	public boolean update(ExerciseJournalDto dto);
	public List<ExerciseListDto> selectExetAll();
	public List<ExerciseListDto> seleteCategory(String exercise_category);
	public ExerciseListDto ExerDetail(int exercise_id);
}
