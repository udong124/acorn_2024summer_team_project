package com.fitconnect.trainer.service;

import java.sql.Date;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fitconnect.trainer.dto.ExerciseJournalDto;
import com.fitconnect.trainer.dto.ExerciseListDto;
import com.fitconnect.trainer.repository.ExerciseJournalDao;
import com.fitconnect.trainer.repository.ExerciseListDao;

@Service
public class ExerciseServiceImpl implements ExerciseService {

	@Autowired private ExerciseListDao listDao;
	@Autowired private ExerciseJournalDao journalDao;
	

	@Override
	public ExerciseJournalDto selectExerJournalOne(int e_journal_id) {
		return journalDao.getExer(e_journal_id);
	}

	

	@Override
	public boolean deleteExer(ExerciseJournalDto dto) {
		boolean isSuccess = journalDao.delete(dto);
		return isSuccess;
	}

	@Override
	public boolean update(ExerciseJournalDto dto) {
		
		boolean isSuccess = journalDao.update(dto);
		System.out.println("serviceImpl"+dto);
		return isSuccess;
		
		
	}

	@Override
	public List<ExerciseListDto> selectExetAll() {
		return listDao.getExerList();
	}

	@Override
	public List<ExerciseListDto> seleteCategory(String exercise_category) {
		return listDao.getcategory(exercise_category);
		
	}

	@Override
	public ExerciseListDto ExerDetail(int exercise_id) {
		
		return listDao.getDetail(exercise_id);
	}


	@Override
	public List<ExerciseJournalDto> SelectJournalAll(int m_calendar_id) {
		return journalDao.getExerJournalList(m_calendar_id);
	}

	@Override
	public boolean deleteExerAll(int m_calendar_id) {
		boolean isSuccess = journalDao.deleteAll(m_calendar_id);
		return isSuccess;
	}

	
	
	public boolean addExercise(List<ExerciseJournalDto> exerJournalList) {
		boolean isSuccess=false;
		for(ExerciseJournalDto dto:exerJournalList) {
			isSuccess = journalDao.insert(dto);
		}
		return isSuccess;
	}
}
