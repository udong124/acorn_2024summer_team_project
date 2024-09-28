package com.fitconnect.service;

import java.util.List;
import java.util.Map;

import com.fitconnect.dto.memberCalendarDto;

public interface memberCalendarService {
	public List<memberCalendarDto> getAll();
	public Map<String, Object> getOne(memberCalendarDto dto);
	public boolean insert(memberCalendarDto dto);
	public boolean update(memberCalendarDto dto);
	public boolean delete(int m_calendar_id);
	
}
