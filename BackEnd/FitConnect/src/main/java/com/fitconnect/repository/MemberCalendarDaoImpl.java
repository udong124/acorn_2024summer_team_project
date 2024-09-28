package com.fitconnect.repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.fitconnect.dto.MemberCalendarDto;


@Repository
public class MemberCalendarDaoImpl implements MemberCalendarDao{

	// 의존객체 주입
	@Autowired SqlSession session;
	
	@Override
	public List<MemberCalendarDto> getList(int user_num) {
		
		return session.selectList("calendar.getList", user_num);
	}

	@Override
	public MemberCalendarDto getData(MemberCalendarDto dto) {
		
		return session.selectOne("calendar.getData", dto);
	}

	@Override
	public boolean insert(MemberCalendarDto dto) {
		
		int result = session.insert("calendar.insert", dto);
		if(result > 0) {
			return true;
		}else {
			return false;
		}
	}

	@Override
	public boolean update(MemberCalendarDto dto) {

		int result = session.update("calendar.update", dto);
		if(result > 0) {
			return true;
		}else {
			return false;
		}
	}
	
	@Override
	public boolean delete(int member_num, int m_calendar_id) {
		Map<String, Object> params = new HashMap<>();
		params.put("member_num", member_num);
		params.put("m_calendar_id", m_calendar_id);
		
		int result = session.delete("calendar.delete", params);
		
		if(result > 0) {
			return true;
		}else {
			return false;
		}
	}


}
