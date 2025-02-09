package com.fitconnect.service;

import java.util.List;
import java.util.Map;

import com.fitconnect.dto.DietJournalDto;
import com.fitconnect.dto.ExerciseJournalDto;
import com.fitconnect.dto.MemberDto;
import com.fitconnect.dto.TrainerCalendarDto;

public interface TrainerCalendarService {
	public List<TrainerCalendarDto> selectCalenList();
	public TrainerCalendarDto selectCalenderOne(int t_calendar_id);
	public boolean addSchedule(TrainerCalendarDto dto);
	public boolean updateSchedule(TrainerCalendarDto dto);
	public boolean deleteSchedule(TrainerCalendarDto dto);
	
	public List<MemberDto> selectMemberList();
	public Map<String, Object> selectMemberOne(int member_num);
	public boolean disconnect(int member_num);
	
	// 특정 멤버의 식단, 운동 일지를 조회할 메소드
	public List<DietJournalDto> getDietJournal(DietJournalDto dto);
	public List<ExerciseJournalDto> getExerJournal(ExerciseJournalDto dto);
}
