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
	
	@Operation(summary = "트레이너 일정 등록", description = "파라미터로 받은 트레이너의 일정 등록")
	@PostMapping("/trainercalendar")
	public Map<String, Object> insertCal(@RequestBody TrainerCalendarDto dto){
		boolean isSuccess = service.addSchedule(dto);
		Map<String, Object> map = new HashMap<String, Object>();
		return Map.of("isSuccess", true);
	}
	
	@Operation(summary = "트레이너 일정 수정", description = "파라미터로 받은 트레이너 캘린더 아이디를 이용한 일정 수정")
	@PutMapping("/trainercalendar/{t_calendar_id}")
	public Map<String, Object> updateCal(@PathVariable("t_calendar_id") int t_calendar_id, TrainerCalendarDto dto){
		
		boolean isSuccess = service.updateSchedule(dto);
		return Map.of("isSuccess", true);
		
	}
	
	@Operation(summary = "트레이너 일정 삭제", description = "일정에 등록되어있던 회원 번호를 이용하여 일정 삭제")
	@DeleteMapping("/trainercalendar/{t_calendar_id}")
	public Map<String, Object> deleteCal(@PathVariable("t_calendar_id") int t_calendar_id, @RequestParam int member_num){
		TrainerCalendarDto dto = new TrainerCalendarDto();
		dto.setT_calendar_id(t_calendar_id);
		dto.setMember_num(member_num);
		boolean isSuccess = service.deleteSchedule(dto);
		Map<String, Object> map = new HashMap<String, Object>();
		return Map.of("isSuccess", isSuccess);
	}
	
	@Operation(summary = "트레이너와 연동된 회원 리스트", description = "파라미터로 받은 트레이너 번호를 가지고 있는 회원의 리스트 가져오기")
	@GetMapping("/trainercalendar/list")
	public Map<String, Object> memberList(){
		List<MemberDto> list=service.selectMemberList();
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("memberList", list);
		
		return map;
	}
	
	
	
	@Operation(summary = "트레이너와 연동된 특정 회원의 상세 정보 페이지", description = "파라미터로 받은 트레이너 번호를 가지고 있는 특정 회원의 상세 정보 페이지 가져오기")
	@GetMapping("/trainercalendar/detail")
	public Map<String, Object> memberOne(@RequestParam int member_num){
		return service.selectMemberOne(member_num);
	}
	
	@Operation(summary = "특정 회원과의 연동 해제", description = "파라미터로 받은 멤버 번호를 이용하여 해당 멤버의 트레이너 번호값 null로 변경")
	@PutMapping("/trainercalendar/detail")
	public Map<String, Object> disconnectMember(@RequestParam int member_num){
		boolean isSuccess = service.disconnect(member_num);
		
		return Map.of("isSuccess", isSuccess);
	}
}
