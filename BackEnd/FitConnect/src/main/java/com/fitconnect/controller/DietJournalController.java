package com.fitconnect.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.fitconnect.auth.PrincipalDetails;
import com.fitconnect.dto.DietJournalDto;
import com.fitconnect.dto.MemberCalendarDto;
import com.fitconnect.dto.UserDto;
import com.fitconnect.service.DietJournalService;
import com.fitconnect.service.MemberCalendarService;


@RestController
public class DietJournalController {
	
	@Autowired DietJournalService service;
	@Autowired MemberCalendarService membercalendarService;
	
	/**********************************************************************
	 * <PRE> * 메소드 정보 *
	 * 1. MethodName	: getList
	 * 2. ClassName		: DietJournalController
	 * 3. 작성자			: uJuu
	 * 4. 작성일			: 2024. 9. 28. 오후 4:18:52
	 * 5. 설명			: 특정 멤버의 식단일지 세부조회
	 * 					  serviceImpl 에서 로그인된 사용자의 토큰값을 이용해서 id 값을 받아와 dto 에 넣어 DB에 넘겨준다
	 * 					  컨트롤러에서는 경로변수로 받아온 캘린더번호를 dto 에 담아서 리스트로 리턴해준다
	 * </PRE>
	 * 		@return Map<String,Object>
	 * 		@param m_calendar_id
	 * 		@param dto
	 * 		@return
	**********************************************************************/
	@GetMapping("/dietjournal/{m_calendar_id}")
	public Map<String, Object> getList(
			@PathVariable("m_calendar_id") int m_calendar_id,
			DietJournalDto dto){
		
		//경로변수에서 받아온 캘린더번호를 dto 에 담는다.
		dto.setM_calendar_id(m_calendar_id);

		List<DietJournalDto> list =  service.getList(dto);
		
		return Map.of("list", list);
	}
	
	
	@GetMapping("/dietjournal/date/{regdate}")
	public Map<String, Object> getListByDate(
			@PathVariable("regdate") String regdate,
			DietJournalDto dto){
		MemberCalendarDto membercalendarDto = new MemberCalendarDto();
		membercalendarDto.setRegdate(regdate);
		// 캘린더Dto에 날짜를 담아서 서비스에 넘겨주면 멤버캘린더서비스에서 회원번호를 담아서 dao를 실행시킨다.
		// getOneByDate 에는 경로변수로 받은 날짜에 해당하는 캘린더 정보(id, num, regdate, memo)와 isSuccess 로 boolean 값이 담겨져 있다.
		Map<String, Object> getOneByDate= membercalendarService.getOneByDate(membercalendarDto);
		
		// m_calendar_id 값이 1개여서 반환된 boolean 값이 true이면
		if((boolean) getOneByDate.get("isSuccess")) {
			// 담겨져 있는 regdate를 활용해서 m_calendar_id 만 추출하고
			int m_calendar_id = ((MemberCalendarDto)getOneByDate.get("result")).getM_calendar_id();
			//dto에 담아준다.
			dto.setM_calendar_id(m_calendar_id);
			//해당 날짜에 해당하는 식단일지 정보와 true 값을 담아서 리턴해준다.
			List<DietJournalDto> list = service.getList(dto);
			return Map.of("isSuccess", true,
							"list", list);
		}else {
			// m_calendar_id 가 없으면 false, 값이 여러개 조회되면 exception 처리
			return Map.of("isSuccess", false);
		}
	}
	
	/**********************************************************************
	 * <PRE> * 메소드 정보 *
	 * 1. MethodName	: insert
	 * 2. ClassName		: DietJournalController
	 * 3. 작성자			: uJuu
	 * 4. 작성일			: 2024. 9. 28. 오후 4:55:24
	 * 5. 설명			: 특정 멤버의 식단일지 등록
	 * 					  경로변수로 받아온 캘린더 번호를 이용해 해당 일자의 식단일지를 등록한다.
	 * </PRE>
	 * 		@return Map<String,Object>
	 * 		@param m_calendar_id
	 * 		@param dietjournalList
	 * 		@return
	**********************************************************************/
	@PostMapping("/dietjournal/{m_calendar_id}")
	public Map<String, Object> insert(
			@PathVariable("m_calendar_id") int m_calendar_id,
			@RequestBody List<DietJournalDto> dietjournalList){
		
		for (DietJournalDto dto : dietjournalList) {
	        dto.setM_calendar_id(m_calendar_id);
	    }
		
	    boolean isSuccess = service.insert(dietjournalList);
		return Map.of("isSuccess", isSuccess);
	}
	
	@PostMapping("/dietjournal/date/{regdate}")
	public Map<String, Object> insertBydate(
			@PathVariable("regdate") String regdate,
			@RequestBody List<DietJournalDto> dietjournalList){
		
		MemberCalendarDto membercalendarDto = new MemberCalendarDto();
		membercalendarDto.setRegdate(regdate);
		// error 제외하고 true 값을 반환
		membercalendarService.insertByDate(membercalendarDto);
		Map<String, Object> getIdByDate = membercalendarService.getOneByDate(membercalendarDto);
		System.out.println(getIdByDate);
		for (DietJournalDto dto : dietjournalList) {
	        dto.setM_calendar_id(((MemberCalendarDto) getIdByDate.get("result")).getM_calendar_id());
	    }
		
	    boolean isSuccess = service.insert(dietjournalList);
		return Map.of("isSuccess", isSuccess);

	}
	
	/**********************************************************************
	 * <PRE> * 메소드 정보 *
	 * 1. MethodName	: update
	 * 2. ClassName		: DietJournalController
	 * 3. 작성자			: uJuu
	 * 4. 작성일			: 2024. 9. 28. 오후 5:36:32
	 * 5. 설명			: 특정 멤버의 식단일지 수정
	 * 					  경로변수로 식단일지 번호를 넘겨받아 해당 일지에 기록된 정보를 수정한다.
	 * </PRE>
	 * 		@return Map<String,Object>
	 * 		@param d_journal_id
	 * 		@param dto
	 * 		@return
	**********************************************************************/
	@PutMapping("/dietjournal/{d_journal_id}")
	public Map<String, Object> update(
			@PathVariable("d_journal_id") int d_journal_id,
			@RequestBody DietJournalDto dto){
		
		dto.setD_journal_id(d_journal_id);
		boolean isSuccess = service.update(dto);
		return Map.of("isSuccess", isSuccess);
	}
	
	/**********************************************************************
	 * <PRE> * 메소드 정보 *
	 * 1. MethodName	: delete
	 * 2. ClassName		: DietJournalController
	 * 3. 작성자			: uJuu
	 * 4. 작성일			: 2024. 9. 28. 오후 5:39:23
	 * 5. 설명			: 특정 멤버의 식단일지 삭제
	 * 					  토큰값을 이용해 사용자 id 를 받아온다.
	 * 					  경로변수로 받아온 일지번호로 해당 일지를 삭제한다.
	 * </PRE>
	 * 		@return Map<String,Object>
	 * 		@param d_journal_id
	 * 		@return
	**********************************************************************/
	@DeleteMapping("/dietjournal/{d_journal_id}")
	public Map<String, Object> delete(
			@PathVariable("d_journal_id") int d_journal_id){

		boolean isSuccess = service.delete(d_journal_id);
		return Map.of("isSuccess", isSuccess);
	}
	
	/**********************************************************************
	 * <PRE> * 메소드 정보 *
	 * 1. MethodName	: deleteAll
	 * 2. ClassName		: DietJournalController
	 * 3. 작성자			: uJuu
	 * 4. 작성일			: 2024. 9. 28. 오후 5:42:13
	 * 5. 설명			: 특정 날짜 식단일지 전체 삭제
	 * 					  토큰값으로 사용자 id 값, 경로변수로 캘린더번호를 가져온다.
	 * 					  DB 에 캘린더번호와 특정 사용자 id 값을 넣어서 일지를 전체 삭제한다.
	 * </PRE>
	 * 		@return Map<String,Object>
	 * 		@param m_calendar_id
	 * 		@return
	**********************************************************************/
	@DeleteMapping("/dietjournal/all/{m_calendar_id}")
	public Map<String, Object> deleteAll(
			@PathVariable("m_calendar_id") int m_calendar_id){
		
		boolean isSuccess = service.deleteAll(m_calendar_id);
		return Map.of("isSuccess", isSuccess);
	}
	
	@DeleteMapping("/dietjournal/all/date/{regdate}")
	public Map<String, Object> deleteAll(
			@PathVariable("regdate") String regdate){
		
		boolean isSuccess = service.deleteAllByDate(regdate);
		return Map.of("isSuccess", isSuccess);
	}
}
