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
	public List<Map<String, Object>> getAll() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		int user_num = ((PrincipalDetails) authentication.getPrincipal()).getDto().getId();
		
		//리스트는 회원에 등록된 전체 캘린더를 담아준다.
		List<MemberCalendarDto> list = dao.getList(user_num);
		List<Map<String, Object>> resultList = new ArrayList<Map<String,Object>>();
		
		
		list.forEach(MemberCalendarDto -> {
			int m_calendar_id = MemberCalendarDto.getM_calendar_id();
			
			
			Map<String, Object> resultMap = new HashMap<>();
			// resultMap에 등록된 캘린더를 반복문을 실행하여 차례대로 담아준다.
			resultMap.put("m_calendar_id", MemberCalendarDto.getM_calendar_id());
			resultMap.put("member_num", MemberCalendarDto.getMember_num());
			resultMap.put("regdate", MemberCalendarDto.getRegdate());
			resultMap.put("memo", MemberCalendarDto.getMemo());
			
			
			if (!exercisejournalDao.getExerJournalList(m_calendar_id).isEmpty()) {
				// m_calendar_id 에 운동일지가 담겨져 있다면
				resultMap.put("memberExerciseDto", exercisejournalDao.getExerJournalList(m_calendar_id));
				resultMap.put("isExistExercise", true);
				
			}else {
				//일지가 없다면
				resultMap.put("isExistExercise", false);
			}
			
			// 식단일지의 dao.getList가 dietjournalDto를 input으로 받기 때문에 따로 Dto를 만들어주고
			DietJournalDto dietjournalDto = new DietJournalDto();
			// m_calendar_id에 해당한 식단일지 정보를 받아오기 위해 초기 값을 넣어준다.
			dietjournalDto.setM_calendar_id(m_calendar_id);
			dietjournalDto.setMember_num(user_num);
			
			if (!dietjournalDao.getList(dietjournalDto).isEmpty()) {
				// 식단일지가 있다면
				resultMap.put("memberDietDto", dietjournalDao.getList(dietjournalDto));
				resultMap.put("isExistDiet", true);
				
			}else {
				// 식단일지가 없다면
				resultMap.put("isExistDiet", false);
			}
			
			resultList.add(resultMap);
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
	public boolean delete(String regdate) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		int user_num = ((PrincipalDetails) authentication.getPrincipal()).getDto().getId();
		
		int m_calendar_id = dao.getMcalendarId(regdate);
		
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
