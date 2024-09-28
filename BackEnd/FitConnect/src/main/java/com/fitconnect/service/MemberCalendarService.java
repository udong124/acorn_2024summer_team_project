package com.fitconnect.service;

import java.util.List;
import java.util.Map;

import com.fitconnect.dto.MemberCalendarDto;

public interface MemberCalendarService {
	public List<MemberCalendarDto> getAll();
	public Map<String, Object> getOne(MemberCalendarDto dto);
	public void insert(MemberCalendarDto dto);
	public void update(MemberCalendarDto dto);
	public void delete(int m_calendar_id);
	
}
