package com.fitconnect.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.fitconnect.auth.PrincipalDetails;
import com.fitconnect.dto.memberCalendarDto;
import com.fitconnect.repository.memberCalendarDao;


@Service
public class memberCalendarServiceImpl implements memberCalendarService{

	@Autowired private memberCalendarDao dao;
	
	@Override
	public List<memberCalendarDto> getAll() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		int user_num = ((PrincipalDetails) authentication.getPrincipal()).getDto().getId();
		
		return dao.getList(user_num);
	}

	@Override
	public Map<String, Object> getOne(memberCalendarDto dto) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		int user_num = ((PrincipalDetails) authentication.getPrincipal()).getDto().getId();
		
		dto.setMember_num(user_num);
		memberCalendarDto resultdto = dao.getData(dto);
		
		return Map.of("dto", resultdto);
	}

	@Override
	public void insert(memberCalendarDto dto) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		int user_num = ((PrincipalDetails) authentication.getPrincipal()).getDto().getId();
		
		dto.setMember_num(user_num);
		dao.insert(dto);
		
	}
	
	@Override
	public void update(memberCalendarDto dto) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		int user_num = ((PrincipalDetails) authentication.getPrincipal()).getDto().getId();
		dto.setMember_num(user_num);
		dao.update(dto);
	}
	
	@Override
	public void delete(int m_calendar_id) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		int user_num = ((PrincipalDetails) authentication.getPrincipal()).getDto().getId();
		
		dao.delete(user_num, m_calendar_id);
	}

}
