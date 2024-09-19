package com.fitconnect.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fitconnect.dto.DietListDto;
import com.fitconnect.service.DietListService;



@RestController
public class DietListController {
	
	@Autowired DietListService service;
	
	@GetMapping("/dietlist")
	public Map<String, Object> list( DietListDto dto){
		dto.setKeyword(dto.getKeyword());
		List<DietListDto> list = service.getList(dto);
		
		return Map.of("list", list);
	}
	
	@PostMapping("/dietlist")
	public Map<String, Object> insert(DietListDto dto) {
		service.insert(dto);
		
		return Map.of("isSuccess", true);
	}
}
