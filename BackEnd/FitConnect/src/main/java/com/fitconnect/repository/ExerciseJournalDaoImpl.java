package com.fitconnect.repository;

import java.sql.Date;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.fitconnect.dto.ExerciseJournalDto;

@Repository
public class ExerciseJournalDaoImpl implements ExerciseJournalDao {

	@Autowired private SqlSession session;
	
	
	@Override
	public List<ExerciseJournalDto> getExerJournalList(int m_calendar_id) {
		return session.selectList("ExerciseJournal.getExerJournalList", m_calendar_id);
	}

	@Override
	public ExerciseJournalDto getExer(int e_journal_id) {
		
		return session.selectOne("ExerciseJournal.getExerOne", e_journal_id);
	}

	

	@Override
	public boolean update(ExerciseJournalDto dto) {
		//수정된 row count 가 리턴된다
		int rowCount=session.update("ExerciseJournal.update", dto);
		if(rowCount>0) {
			return true;
		}else{
			return false;
		}
	}

	@Override
	public boolean delete(ExerciseJournalDto dto) {
		int rowCount=session.delete("ExerciseJournal.delete", dto);
		if(rowCount>0) {
			return true;
		}else{
			return false;
		}
	}

	@Override
	public boolean deleteAll(int m_calendar_id) {
		int rowCount=session.delete("ExerciseJournal.deleteAll", m_calendar_id);
		if(rowCount>0) {
			return true;
		}else{
			return false;
		}
	}
	
	
	
	
	
	
	
	
	
	

	@Override
	public boolean insert(ExerciseJournalDto dto) {
		int rowCount=session.insert("ExerciseJournal.insert", dto);
		if(rowCount>0) {
			return true;
		}else{
			return false;
		}
		
	}

}
