package com.fitconnect.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.fitconnect.auth.PrincipalDetails;
import com.fitconnect.dto.DietJournalDto;
import com.fitconnect.dto.ExerciseJournalDto;
import com.fitconnect.dto.MemberCalendarDto;
import com.fitconnect.exception.NotCalendarIdOneException;
import com.fitconnect.repository.DietJournalDao;
import com.fitconnect.repository.ExerciseJournalDao;
import com.fitconnect.repository.MemberCalendarDao;


@Service
public class MemberCalendarServiceImpl implements MemberCalendarService{

	@Autowired private MemberCalendarDao dao;
	@Autowired private DietJournalDao dietjournalDao;
	@Autowired private ExerciseJournalDao exercisejournalDao;
	
	@Override
		//로그인된 사용자 토큰을 이용해서 id 값을 얻어와 user_num 이라는 이름으로 DB 에 담아서 dao 를 실행한다.

	public List<Map<String, Object>> getAll() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		int user_num = ((PrincipalDetails) authentication.getPrincipal()).getDto().getId();
		
		List<MemberCalendarDto> list = dao.getList(user_num);
		List<Map<String, Object>> resultList = new ArrayList<Map<String,Object>>();
		
		list.forEach(MemberCalendarDto -> {
			int m_calendar_id = MemberCalendarDto.getM_calendar_id();
			
			Map<String, Object> resultMap = new HashMap<>();
			
			resultMap.put("m_calendar_id", MemberCalendarDto.getM_calendar_id());
			resultMap.put("member_num", MemberCalendarDto.getM_calendar_id());
			resultMap.put("regdate", MemberCalendarDto.getRegdate());
			resultMap.put("memo", MemberCalendarDto.getMemo());
			
			if (!exercisejournalDao.getExerJournalList(m_calendar_id).isEmpty()) {

				resultMap.put("memberExerciseDto", exercisejournalDao.getExerJournalList(m_calendar_id));
//				System.out.println("Map:" + resultMap);
				resultList.add(resultMap);
				
			}
			DietJournalDto dietjournalDto = new DietJournalDto();
			dietjournalDto.setM_calendar_id(m_calendar_id);
			dietjournalDto.setMember_num(user_num);
			
			if (!dietjournalDao.getList(dietjournalDto).isEmpty()) {
				resultMap.put("memberDietDto", dietjournalDao.getList(dietjournalDto));
//				System.out.println("다이어트:" + resultMap);
				resultList.add(resultMap);
			}
			
		});
		System.out.println(resultList);
		return resultList;
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
	public Map<String, Object> getOneByDate(MemberCalendarDto dto) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		int user_num = ((PrincipalDetails) authentication.getPrincipal()).getDto().getId();
		
		dto.setMember_num(user_num);
		Map<String, Object> getByDate = dao.getDataByDate(dto);
		
		return getByDate;
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
	public boolean insertByDate(MemberCalendarDto dto) {
		
		// input으로 regdate, memo null 값 가능
		System.out.println(dto);
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		int user_num = ((PrincipalDetails) authentication.getPrincipal()).getDto().getId();
		
		dto.setMember_num(user_num);
		
		Map<String, Object> getByDate = dao.getDataByDate(dto);
		
		if((boolean) getByDate.get("isSuccess")) {
			return true;
		}else {
			if(dto.getMemo() == null) {
				dto.setMemo("");
			}
			return dao.insert(dto);
		}
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
