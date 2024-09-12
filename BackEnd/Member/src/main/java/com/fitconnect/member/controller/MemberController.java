package com.fitconnect.member.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.fitconnect.member.memberset.MemberDto;
import com.fitconnect.member.service.MemberService;

import io.swagger.v3.oas.annotations.tags.Tag;

@Tag
(name = "Exercise API", description = "컨트롤러에 대한 설명입니다.")

@RestController
public class MemberController {
	
	@Autowired private MemberService service;
	

	//회원의 정보를 추가하는 API 
	@PostMapping ("/memberlnfo/setup")
	public MemberDto insert(@RequestBody MemberDto dto) {
		return service.createMember(dto);
	}
		
	//회원의 정보를 수정(업데이트) 하는 API
	@PutMapping("/member/{member_num}/update")
	public MemberDto update(@RequestBody MemberDto dto) {
		service.updateMember(dto);
		return dto;
	}
	
	//회원의 정보를 삭제하는 API
	@DeleteMapping("/member/{member_num}/delete")
	public Map<String, Object> delete(@PathVariable("num") int num){
		service.deleteMember(num);
		Map<String, Object> map=new HashMap<>();
		map.put("isSuccess", true);
		
		return map;
	}
}