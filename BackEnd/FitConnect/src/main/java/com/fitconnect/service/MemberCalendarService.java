package com.fitconnect.service;

import java.util.List;
import java.util.Map;

import com.fitconnect.dto.MemberCalendarDto;

public interface MemberCalendarService {
	public List<Map<String, Object>> getAll();
	public Map<String, Object> getOne(MemberCalendarDto dto);
	public Map<String, Object> getOneByDate(MemberCalendarDto dto);
	
	public boolean insert(MemberCalendarDto dto);
	public boolean insertByDate(MemberCalendarDto dto);
	
	public boolean update(MemberCalendarDto dto);
	public boolean delete(String regdate);
	public boolean getCalendarId(String regdate);
	public int getMCalendarId(String regdate);
}
