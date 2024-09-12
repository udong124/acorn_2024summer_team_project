package com.fitconnect.trainer.repository;

import java.util.List;


import com.fitconnect.trainer.dto.ExerciseJournalDto;
import com.fitconnect.trainer.dto.MemberDto;
import com.fitconnect.trainer.dto.TrainerCalendarDto;

public interface TrainerCalendarDao {
	public List<TrainerCalendarDto> getCalenList(int user_id);
	public TrainerCalendarDto getCalender(int t_calendar_id);
	public boolean insert(TrainerCalendarDto dto);
	public boolean update(TrainerCalendarDto dto);
	public boolean delete(TrainerCalendarDto dto);
	
	public MemberDto getMemberOne(int member_num);
	public List<MemberDto> getMemberList(int user_id); 
	
	public boolean disconnect(int member_num);
	
}
