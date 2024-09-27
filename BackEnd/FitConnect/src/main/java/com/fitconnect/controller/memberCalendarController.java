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
	
	//특정 멤버 캘린더 리스트 불러와서 달력에 정보 뿌리기
	@GetMapping("/membercalendar") //
	public List<memberCalendarDto> getList(){
		
		List<memberCalendarDto> list = service.getAll();
		return list;
	}
	
	//특정 멤버 캘린더 정보 세부조회
	@GetMapping("/membercalendar/{m_calendar_id}")
	public Map<String, Object> getMemberData(
			@PathVariable("m_calendar_id") int m_calendar_id,
			memberCalendarDto dto) {
		dto.setM_calendar_id(m_calendar_id);
		
		return service.getOne(dto);
	}
	
	//특정 멤버 캘린더 등록
	@PostMapping("/membercalendar")
	public Map<String, Object> insertCal(@RequestBody memberCalendarDto dto) {
		
		service.insert(dto);
		
		return Map.of("isSuccess", true);
	}
	
	//특정 멤버 캘린더 정보 수정
	@PutMapping("/membercalendar/{m_calendar_id}")
	public memberCalendarDto updateCal(
			@PathVariable("m_calendar_id") int m_calendar_id, 
			@RequestBody memberCalendarDto dto) {
		dto.setM_calendar_id(m_calendar_id);
		service.update(dto);
		
		return dto;
	}
	//특정 멤버 캘린더 삭제
	@DeleteMapping("/membercalendar/{m_calendar_id}")
	public Map<String, Object> deleteCal(
			@PathVariable("m_calendar_id") int m_calendar_id) {
		
		service.delete(m_calendar_id);
		return Map.of("isSuccess", true);
	}
	
}
