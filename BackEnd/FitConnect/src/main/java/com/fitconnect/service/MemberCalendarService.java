package com.fitconnect.service;

import java.util.List;
import java.util.Map;

import com.fitconnect.dto.MemberCalendarDto;

public interface MemberCalendarService {
	public List<MemberCalendarDto> getAll();
	public Map<String, Object> getOne(MemberCalendarDto dto);
	public boolean insert(MemberCalendarDto dto);
	public boolean update(MemberCalendarDto dto);
	public boolean delete(int m_calendar_id);
	
}
