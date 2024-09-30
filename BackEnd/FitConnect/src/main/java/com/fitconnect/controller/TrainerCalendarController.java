package com.fitconnect.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Delete;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fitconnect.dto.MemberDto;
import com.fitconnect.dto.TrainerCalendarDto;
import com.fitconnect.service.TrainerCalendarService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.websocket.server.PathParam;
import lombok.Delegate;
@Tag(name = "Trainer Calendar API", description = "컨트롤러에 대한 설명입니다.")
@RestController
public class TrainerCalendarController {

	@Autowired private TrainerCalendarService service;
	
	/**********************************************************************
	 * <PRE> * 메소드 정보 *
	 * 1. MethodName	: calendarList
	 * 2. ClassName		: TrainerCalendarController
	 * 3. 작성자			: songminjung
	 * 4. 작성일			: 2024. 9. 30. 오후 12:49:13
	 * 5. 설명			: 트레이너의 등록된 전체 일정을 조회하는 메소드
	 * 					  토큰에 저장된 트레이너 정보와 연결된 멤버 리스트와 등록된 전체 일정 목록을 조회한다.
	 * </PRE>
	 * 		@return Map<String,Object>
	 * 		@return ("memList", memList) and ("calList", calList)
	**********************************************************************/
	@Operation(summary = "트레이너 캘린더 전체 일정", description = "토큰에 담긴 로그인 된 트레이너의 일정 정보와 멤버 리스트를 전달")
	@GetMapping("/trainercalendar")
	public Map<String, Object> calendarList() {
		
		List<TrainerCalendarDto> calList = service.selectCalenList();
		List<MemberDto> memList = service.selectMemberList();
		
		Map<String, Object> map=new HashMap<String, Object>();
		map.put("memList", memList);
		map.put("calList", calList);
	
		return map;
	}
	
	/**********************************************************************
	 * <PRE> * 메소드 정보 *
	 * 1. MethodName	: insertCal
	 * 2. ClassName		: TrainerCalendarController
	 * 3. 작성자			: songminjung
	 * 4. 작성일			: 2024. 9. 30. 오후 12:49:20
	 * 5. 설명			: 트레이너의 일정을 등록하는 메소드
	 * 					  토큰의 저장된 트레이너 정보와 json형태의 member_num, regdate 값을 받아와 일정을 등록한다.
	 * </PRE>
	 * 		@return Map<String,Object>
	 * 		@param dto
	 * 		@return "isSuccess", true or false
	**********************************************************************/
	@Operation(summary = "트레이너 일정 등록", description = "파라미터로 받은 트레이너의 일정 등록")
	@PostMapping("/trainercalendar")
	public Map<String, Object> insertCal(@RequestBody TrainerCalendarDto dto){
		boolean isSuccess = service.addSchedule(dto);

		return Map.of("isSuccess", isSuccess);
	}
	
	/**********************************************************************
	 * <PRE> * 메소드 정보 *
	 * 1. MethodName	: updateCal
	 * 2. ClassName		: TrainerCalendarController
	 * 3. 작성자			: songminjung
	 * 4. 작성일			: 2024. 9. 30. 오후 12:49:23
	 * 5. 설명			: 트레이너의 일정을 수정하는 메소드
	 * 					  경로변수로 받은 t_calendar_id를 이용하여 member_num, regdate 값을 수정한다.
	 * </PRE>
	 * 		@return Map<String,Object>
	 * 		@param t_calendar_id
	 * 		@param dto
	 * 		@return  "isSuccess", true or false
	**********************************************************************/
	@Operation(summary = "트레이너 일정 수정", description = "파라미터로 받은 트레이너 캘린더 아이디를 이용한 일정 수정")
	@PutMapping("/trainercalendar/{t_calendar_id}")
	public Map<String, Object> updateCal(@PathVariable("t_calendar_id") int t_calendar_id, 
			@RequestBody TrainerCalendarDto dto){
		dto.setT_calendar_id(t_calendar_id);
		boolean isSuccess = service.updateSchedule(dto);
		return Map.of("isSuccess", isSuccess);
		
	}
	
	/**********************************************************************
	 * <PRE> * 메소드 정보 *
	 * 1. MethodName	: deleteCal
	 * 2. ClassName		: TrainerCalendarController
	 * 3. 작성자			: songminjung
	 * 4. 작성일			: 2024. 9. 30. 오후 12:49:27
	 * 5. 설명			: 트레이너 캘린더 내의 특정 일정 삭제
	 * 					  경로변수로 받아온 t_calendar_id 값과 member_num 값을 이용하여 특정 날짜의 특정 일정을 삭제한다.
	 * </PRE>
	 * 		@return Map<String,Object>
	 * 		@param t_calendar_id
	 * 		@param member_num
	 * 		@return "isSuccess", true or false
	**********************************************************************/
	@Operation(summary = "트레이너 일정 삭제", description = "일정에 등록되어있던 회원 번호를 이용하여 일정 삭제")
	@DeleteMapping("/trainercalendar/{t_calendar_id}")
	public Map<String, Object> deleteCal(@PathVariable("t_calendar_id") int t_calendar_id, @RequestParam int member_num){
		TrainerCalendarDto dto = new TrainerCalendarDto();
		dto.setT_calendar_id(t_calendar_id);
		dto.setMember_num(member_num);
		boolean isSuccess = service.deleteSchedule(dto);

		return Map.of("isSuccess", isSuccess);
	}
	
	/**********************************************************************
	 * <PRE> * 메소드 정보 *
	 * 1. MethodName	: memberList
	 * 2. ClassName		: TrainerCalendarController
	 * 3. 작성자			: songminjung
	 * 4. 작성일			: 2024. 9. 30. 오후 12:49:30
	 * 5. 설명			: 특정 트레이너와 연결된 회원 리스트를 조회하는 메소드
	 * 					  토큰에 담긴 트레이너의 정보를 이용하여 해당 트레이너와 연결된 회원의 리스트를 조회한다.
	 * </PRE>
	 * 		@return Map<String,Object>
	 * 		@return "memberList", list
	**********************************************************************/
	@Operation(summary = "트레이너와 연동된 회원 리스트", description = "토큰에 담긴 트레이너 번호를 가지고 있는 회원의 리스트 가져오기")
	@GetMapping("/trainercalendar/list")
	public Map<String, Object> memberList(){
		List<MemberDto> list=service.selectMemberList();
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("memberList", list);
		
		return map;
	}
	
	
	
	/**********************************************************************
	 * <PRE> * 메소드 정보 *
	 * 1. MethodName	: memberOne
	 * 2. ClassName		: TrainerCalendarController
	 * 3. 작성자			: songminjung
	 * 4. 작성일			: 2024. 9. 30. 오후 12:49:32
	 * 5. 설명			: 특정 트레이너와 연결된 특정 회원 1명의 상세 정보를 조회하는 메소드
	 * 					  파라미터로 받은 member_num 을 이용하여 토큰값에 담긴 트레이너 정보와 연결된 특정 회원의 상세정보를 조회한다.
	 * </PRE>
	 * 		@return Map<String,Object>
	 * 		@param member_num
	 * 		@return memberDto
	**********************************************************************/
	@Operation(summary = "트레이너와 연동된 특정 회원의 상세 정보 페이지", description = "토큰에 담긴 트레이너 번호를 가지고 있는 특정 회원의 상세 정보 페이지 가져오기")
	@GetMapping("/trainercalendar/detail")
	public Map<String, Object> memberOne(@RequestParam int member_num){
		return service.selectMemberOne(member_num);
	}
	
	/**********************************************************************
	 * <PRE> * 메소드 정보 *
	 * 1. MethodName	: disconnectMember
	 * 2. ClassName		: TrainerCalendarController
	 * 3. 작성자			: songminjung
	 * 4. 작성일			: 2024. 9. 30. 오후 12:49:35
	 * 5. 설명			: 특정 트레이너와 연결된 특정 회원 1명과의 연결을 끊는 메소드
	 * 					  파라미터로 받아온 member_num 을 이용하여 해당 회원의 trainer_num 을 null 값으로 변경한다.
	 * </PRE>
	 * 		@return Map<String,Object>
	 * 		@param member_num
	 * 		@return "isSuccess", true or false
	**********************************************************************/
	@Operation(summary = "특정 회원과의 연동 해제", description = "파라미터로 받은 멤버 번호를 이용하여 해당 멤버의 트레이너 번호값 null로 변경")
	@PutMapping("/trainercalendar/detail")
	public Map<String, Object> disconnectMember(@RequestParam int member_num){
		boolean isSuccess = service.disconnect(member_num);
		
		return Map.of("isSuccess", isSuccess);
	}
}
