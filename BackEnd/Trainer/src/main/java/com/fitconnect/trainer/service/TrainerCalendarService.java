package com.fitconnect.trainer.service;

import java.util.List;
import java.util.Map;


import com.fitconnect.trainer.dto.ExerciseJournalDto;
import com.fitconnect.trainer.dto.MemberDto;
import com.fitconnect.trainer.dto.TrainerCalendarDto;

public interface TrainerCalendarService {
	public List<TrainerCalendarDto> selectCalenList();
	public TrainerCalendarDto selectCalenderOne(int t_calendar_id);
	public boolean addSchedule(TrainerCalendarDto dto);
	public boolean updateSchedule(TrainerCalendarDto dto);
	public boolean deleteSchedule(TrainerCalendarDto dto);
	
	public List<MemberDto> selectMemberList();
	public Map<String, Object> selectMemberOne(int member_num);
	public boolean disconnect(int member_num);
}
