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
		
		//여기서 list는 회원에 등록된 전체 캘린더를 담아준다.
		List<MemberCalendarDto> list = dao.getList(user_num);
		//결과 값을 return 할 resultList 를 만들어준다.
		List<Map<String, Object>> resultList = new ArrayList<Map<String,Object>>();
		
		//반복문을 돌려서
		list.forEach(MemberCalendarDto -> {
			//list에 있는 캘린더 번호를 순서대로 담는다
			int m_calendar_id = MemberCalendarDto.getM_calendar_id();
			
			Map<String, Object> resultMap = new HashMap<>();
			// resultMap에 캘린더 번호에 해당하는 정보를 담아주고
			resultMap.put("m_calendar_id", MemberCalendarDto.getM_calendar_id());
			resultMap.put("member_num", MemberCalendarDto.getMember_num());
			resultMap.put("regdate", MemberCalendarDto.getRegdate());
			resultMap.put("memo", MemberCalendarDto.getMemo());
			
			
			if (!exercisejournalDao.getExerJournalList(m_calendar_id).isEmpty()) {
				// 캘린더 번호에 운동일지가 존재한다면 운동일지 정보와 함께 true를 담아준다.
				resultMap.put("memberExerciseDto", exercisejournalDao.getExerJournalList(m_calendar_id));
				resultMap.put("isExistExercise", true);
				
			}else {
				//일지가 없다면 false를 담아준다.
				resultMap.put("isExistExercise", false);
			}
			
			// 식단일지의 dao.getList가 dietjournalDto를 input으로 받기 때문에 따로 Dto를 만들어주고
			DietJournalDto dietjournalDto = new DietJournalDto();
			// 캘린더 번호에 해당한 식단일지 정보를 받아오기 위해 초기 값을 넣어준다.
			dietjournalDto.setM_calendar_id(m_calendar_id);
			dietjournalDto.setMember_num(user_num);
			
			if (!dietjournalDao.getList(dietjournalDto).isEmpty()) {
				// 식단일지가 존재한다면 식단 정보와 함께 true를 담아주고
				resultMap.put("memberDietDto", dietjournalDao.getList(dietjournalDto));
				resultMap.put("isExistDiet", true);
				
			}else {
				// 식단일지가 존재하지 않으면 false 를 담아준다.
				resultMap.put("isExistDiet", false);
			}
			// 등록된 캘린더 번호에 캘린더 정보, 식단일지 정보, 운동일지 정보를 담아주고
			// 모든 캘린더 번호를 찍을 때까지 이 과정을 반복한다.
			resultList.add(resultMap);
		});
		// 반복문으로 캘린더 번호를 다 찍었다면 결과값을 리턴해준다.
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
		// 현재 dto 에는 날짜와 회원번호가 담겨져 있다.
		Map<String, Object> getByDate = dao.getDataByDate(dto);
		
		return getByDate;
	}
	
	@Override
	public Map<String, Object> getOneByDateTrainer(MemberCalendarDto dto) {
		
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
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		int user_num = ((PrincipalDetails) authentication.getPrincipal()).getDto().getId();
		
		dto.setMember_num(user_num);
		//getByDate에 생성된 캘린더번호와 함께 boolean 값이 담겨져있다.
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
	public boolean deleteByDate(MemberCalendarDto dto) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		int user_num = ((PrincipalDetails) authentication.getPrincipal()).getDto().getId();
		dto.setMember_num(user_num);
		// 현재 dto 에는 날짜와 회원번호가 담겨져있다.
		int m_calendar_id = dao.getMcalendarId(dto.getRegdate());
		//날짜와 회원번호가 일치한 캘린더 번호를 담아주고 delete 한다.
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
