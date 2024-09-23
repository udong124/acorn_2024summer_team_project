package com.fitconnect.repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.fitconnect.dto.DietJournalDto;



@Repository
public class DietJournalDaoImpl implements DietJournalDao{
	
	@Autowired SqlSession session;
	
	@Override
	public List<DietJournalDto> getList(DietJournalDto dto) {
		
		return session.selectList("dietjournal.getList", dto);
	}

	@Override
	public void insert(DietJournalDto dto) {
		
		session.insert("dietjournal.insert", dto);
	}

	@Override
	public void update(DietJournalDto dto) {
		
		session.update("dietjournal.update", dto);
	}

	@Override
	public void delete(int member_num, int d_journal_id) {
		Map<String, Object> params = new HashMap<>();
		params.put("member_num", member_num);
		params.put("d_journal_id", d_journal_id);
		session.delete("dietjournal.deleteOne", params);
	}

	@Override
	public void deleteAll(int member_num, int m_calendar_id) {
		Map<String, Object> params = new HashMap<>();
		params.put("member_num", member_num);
		params.put("m_calendar_id", m_calendar_id);
		session.delete("dietjournal.deleteAll", params);
	}

}
