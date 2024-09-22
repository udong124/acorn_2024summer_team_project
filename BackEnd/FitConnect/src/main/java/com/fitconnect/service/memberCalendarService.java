package com.fitconnect.service;

import java.util.List;
import java.util.Map;

import com.fitconnect.dto.memberCalendarDto;

public interface memberCalendarService {
	public List<memberCalendarDto> getAll();
	public Map<String, Object> getOne(memberCalendarDto dto);
	public void insert(memberCalendarDto dto);
	public void update(memberCalendarDto dto);
	public void delete(int m_calendar_id);
	
}
