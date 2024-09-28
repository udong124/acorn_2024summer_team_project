package com.fitconnect.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fitconnect.dto.memberCalendarDto;
import com.fitconnect.service.memberCalendarService;



@RestController
public class memberCalendarController {
	
	@Autowired private memberCalendarService service;
	
	/**********************************************************************
	 * <PRE> * 메소드 정보 *
	 * 1. MethodName	: getList
	 * 2. ClassName		: memberCalendarController
	 * 3. 작성자			: uJuu
	 * 4. 작성일			: 2024. 9. 28. 오후 5:48:33
	 * 5. 설명			: 특정 멤버 캘린더 리스트 불러와서 달력에 전체 정보 조회
	 * 					  토큰에 사용자 id 값을 이용해서 해당 유저가 저장한 캘린더 정보를 전체 조회한다.
	 * 					  월별로 조회할 수 있다.
	 * </PRE>
	 * 		@return List<memberCalendarDto>
	 * 		@return
	**********************************************************************/
	@GetMapping("/membercalendar") //
	public List<memberCalendarDto> getList(){
		
		List<memberCalendarDto> list = service.getAll();
		return list;
	}
	
	/**********************************************************************
	 * <PRE> * 메소드 정보 *
	 * 1. MethodName	: getMemberData
	 * 2. ClassName		: memberCalendarController
	 * 3. 작성자			: uJuu
	 * 4. 작성일			: 2024. 9. 28. 오후 5:53:00
	 * 5. 설명			: 특정 멤버 캘린더 정보 세부조회
	 * 					  경로변수로 캘린더 번호, 토큰으로 사용자 id를 사용해 해당 사용자의 특정 날짜에 정보를 조회한다.
	 * </PRE>
	 * 		@return Map<String,Object>
	 * 		@param m_calendar_id
	 * 		@param dto
	 * 		@return
	**********************************************************************/
	@GetMapping("/membercalendar/{m_calendar_id}")
	public Map<String, Object> getMemberData(
			@PathVariable("m_calendar_id") int m_calendar_id,
			memberCalendarDto dto) {
		dto.setM_calendar_id(m_calendar_id);
		
		return service.getOne(dto);
	}
	
	/**********************************************************************
	 * <PRE> * 메소드 정보 *
	 * 1. MethodName	: insertCal
	 * 2. ClassName		: memberCalendarController
	 * 3. 작성자			: uJuu
	 * 4. 작성일			: 2024. 9. 28. 오후 5:53:57
	 * 5. 설명			: 특정 멤버 캘린더 등록
	 * 					  사용자 토큰으로 id 값을 이용해서 JSON 형식으로 원하는 날짜에 정보를 등록한다.
	 * </PRE>
	 * 		@return Map<String,Object>
	 * 		@param dto
	 * 		@return
	**********************************************************************/
	@PostMapping("/membercalendar")
	public Map<String, Object> insertCal(@RequestBody memberCalendarDto dto) {
		
		boolean isSuccess = service.insert(dto);
		
		return Map.of("isSuccess", isSuccess);
	}
	
	/**********************************************************************
	 * <PRE> * 메소드 정보 *
	 * 1. MethodName	: updateCal
	 * 2. ClassName		: memberCalendarController
	 * 3. 작성자			: uJuu
	 * 4. 작성일			: 2024. 9. 28. 오후 5:55:49
	 * 5. 설명			: 특정 멤버 캘린더 정보 수정
	 * 					  경로변수로 캘린더번호, 사용자 토큰값으로 id 값을 이용해서 특정 날짜의 캘린더정보를 수정한다.
	 * </PRE>
	 * 		@return Map<String,Object>
	 * 		@param m_calendar_id
	 * 		@param dto
	 * 		@return
	**********************************************************************/
	@PutMapping("/membercalendar/{m_calendar_id}")
	public Map<String, Object> updateCal(
			@PathVariable("m_calendar_id") int m_calendar_id, 
			@RequestBody memberCalendarDto dto) {
		dto.setM_calendar_id(m_calendar_id);
		boolean isSuccess = service.update(dto);
		
		return Map.of("isSuccess", isSuccess);
	}
	
	/**********************************************************************
	 * <PRE> * 메소드 정보 *
	 * 1. MethodName	: deleteCal
	 * 2. ClassName		: memberCalendarController
	 * 3. 작성자			: uJuu
	 * 4. 작성일			: 2024. 9. 28. 오후 5:57:00
	 * 5. 설명			: 특정 멤버 캘린더 삭제
	 * 					  경로변수와 토큰 값으로 캘린더 번호와 사용자 id 값을 이용해 특정 날짜의 캘린더 정보를 삭제한다.
	 * </PRE>
	 * 		@return Map<String,Object>
	 * 		@param m_calendar_id
	 * 		@return
	**********************************************************************/
	@DeleteMapping("/membercalendar/{m_calendar_id}")
	public Map<String, Object> deleteCal(
			@PathVariable("m_calendar_id") int m_calendar_id) {
		
		boolean isSuccess = service.delete(m_calendar_id);
		return Map.of("isSuccess", isSuccess);
	}
	
}
