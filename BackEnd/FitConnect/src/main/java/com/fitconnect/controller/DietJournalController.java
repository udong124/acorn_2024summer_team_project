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
import com.fitconnect.dto.UserDto;
import com.fitconnect.service.DietJournalService;


@RestController
public class DietJournalController {
	
	@Autowired DietJournalService service;
	
	//특정 멤버의 식단일지 세부조회
	@GetMapping("/dietjournal/{m_calendar_id}")
	public Map<String, Object> getList(
			@PathVariable("m_calendar_id") int m_calendar_id,
			DietJournalDto dto){
		
		//경로변수에서 받아온 캘린더번호를 dto 에 담는다.
		dto.setM_calendar_id(m_calendar_id);

		List<DietJournalDto> list =  service.getList(dto);
		
		return Map.of("list", list);
	}
	
	//특정 멤버의 식단일지 등록
	@PostMapping("/dietjournal/{m_calendar_id}")
	public Map<String, Object> insert(
			@PathVariable("m_calendar_id") int m_calendar_id,
			@RequestBody List<DietJournalDto> dietjournalList){
		
		for (DietJournalDto dto : dietjournalList) {
	        dto.setM_calendar_id(m_calendar_id);
	    }
		
	    service.insert(dietjournalList);
		return Map.of("isSuccess", true);
	}
	
	//특정 멤버의 식단일지 수정
	@PutMapping("/dietjournal/{d_journal_id}")
	public Map<String, Object> update(
			@PathVariable("d_journal_id") int d_journal_id,
			DietJournalDto dto){
		
		dto.setD_journal_id(d_journal_id);
		service.update(dto);
		return Map.of("isSuccess", true);
	}
	
	//특정 멤버의 식단일지 삭제
	@DeleteMapping("/dietjournal/{d_journal_id}")
	public Map<String, Object> delete(
			@PathVariable("d_journal_id") int d_journal_id){

		service.delete(d_journal_id);
		return Map.of("isSuccess", true);
	}
	
	//특정 날짜 식단일지 전체 삭제
	@DeleteMapping("/dietjournal/all/{m_calendar_id}")
	public Map<String, Object> deleteAll(
			@PathVariable("m_calendar_id") int m_calendar_id){
		
		service.deleteAll(m_calendar_id);
		return Map.of("isSuccess", true);
	}
}
