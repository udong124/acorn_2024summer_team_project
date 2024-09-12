package com.fitconnect.trainer.repository;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;


import com.fitconnect.trainer.dto.ExerciseJournalDto;
import com.fitconnect.trainer.dto.MemberDto;
import com.fitconnect.trainer.dto.TrainerCalendarDto;

@Repository
public class TrainerCalendarDaoImpl implements TrainerCalendarDao {
	
	@Autowired private SqlSession session;

	@Override
	public List<TrainerCalendarDto> getCalenList(int user_id) {
		
		return session.selectList("TrainerCalendar.getList", user_id);
	}

	@Override
	public TrainerCalendarDto getCalender(int t_calender_id) {
		
		return session.selectOne("TrainerCalendar.getSchedule", t_calender_id);
	}

	public boolean insert(TrainerCalendarDto dto) {
		int rowCount=session.insert("TrainerCalendar.insert", dto);
		if(rowCount>0) {
			return true;
		}else{
			return false;
		}
	}
	

	@Override
	public boolean update(TrainerCalendarDto dto) {
		int rowCount=session.update("TrainerCalendar.update", dto);
		if(rowCount>0) {
			return true;
		}else{
			return false;
		}
	
	}

	@Override
	public boolean delete(TrainerCalendarDto dto) {
		int rowCount=session.delete("TrainerCalendar.delete", dto);
		if(rowCount>0) {
			return true;
		}else{
			return false;
		}
	}

	@Override
	public MemberDto getMemberOne(int member_num) {
		return session.selectOne("TrainerCalendar.getMember", member_num);
	}

	@Override
	public List<MemberDto> getMemberList(int user_id) {
		return session.selectList("TrainerCalendar.getMemberAll", user_id);
	}
	

	@Override
	public boolean disconnect(int member_num) {
		int rowCount=session.update("TrainerCalendar.disconnect", member_num);
		if(rowCount>0) {
			return true;
		}else{
			return false;
		}
		
	}



}
