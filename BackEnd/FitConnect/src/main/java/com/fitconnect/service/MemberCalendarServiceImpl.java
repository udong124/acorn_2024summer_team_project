package com.fitconnect.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.fitconnect.auth.PrincipalDetails;
import com.fitconnect.dto.MemberCalendarDto;
import com.fitconnect.exception.NotCalendarIdOneException;
import com.fitconnect.repository.MemberCalendarDao;


@Service
public class MemberCalendarServiceImpl implements MemberCalendarService{

	@Autowired private MemberCalendarDao dao;
	
	@Override
		//로그인된 사용자 토큰을 이용해서 id 값을 얻어와 user_num 이라는 이름으로 DB 에 담아서 dao 를 실행한다.

	public List<MemberCalendarDto> getAll() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		int user_num = ((PrincipalDetails) authentication.getPrincipal()).getDto().getId();
		
		return dao.getList(user_num);
	}

	@Override
	public Map<String, Object> getOne(MemberCalendarDto dto) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		int user_num = ((PrincipalDetails) authentication.getPrincipal()).getDto().getId();
		
		dto.setMember_num(user_num);
		MemberCalendarDto resultdto = dao.getData(dto);
		
		return Map.of("dto", resultdto);
	}

	@Override
	public boolean insert(MemberCalendarDto dto) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		int user_num = ((PrincipalDetails) authentication.getPrincipal()).getDto().getId();
		
		dto.setMember_num(user_num);
		boolean isSuccess = dao.insert(dto);
		
		return isSuccess;
		
	}
	
	@Override
	public boolean update(MemberCalendarDto dto) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		int user_num = ((PrincipalDetails) authentication.getPrincipal()).getDto().getId();
		dto.setMember_num(user_num);
		boolean isSuccess = dao.update(dto);
		
		return isSuccess;
	}
	
	@Override
	public boolean delete(int m_calendar_id) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		int user_num = ((PrincipalDetails) authentication.getPrincipal()).getDto().getId();
		
		boolean isSuccess = dao.delete(user_num, m_calendar_id);
		
		return isSuccess;
	}

	@Override
	public boolean getCalendarId(String regdate) {
		boolean isSuccess = dao.getCalendarId(regdate);
		return isSuccess;
	}

	@Override
	public int getMCalendarId(String regdate) {
		
		return dao.getMcalendarId(regdate);
	}

}
