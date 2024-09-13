package com.fitconnect.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fitconnect.dto.TrainerDto;
import com.fitconnect.service.TrainerService;

import io.swagger.v3.oas.annotations.parameters.RequestBody;

@RestController
public class TrainerController {
	
	@Autowired private TrainerService service;
	
	//회원의 정보를 추가하는 API 
	@PostMapping ("/trainerlnfo/{trianer_num}/setup")
	public TrainerDto insert(@RequestBody TrainerDto dto) {
		return service.createTrainer(dto);
	}
		
	//회원의 정보를 수정(업데이트) 하는 API
	@PutMapping("/trianer/{trainer_num}/update")
	public TrainerDto update(@RequestBody TrainerDto dto) {
		service.updateTrainer(dto);
		return dto;
	}
	
	//회원의 정보를 삭제하는 API
	@DeleteMapping("/trainer/{trainer_num}/delete")
	public Map<String, Object> delete(@PathVariable("num") int num){
		service.deleteTrainer(num);
		Map<String, Object> map=new HashMap<>();
		map.put("isSuccess", true);
		
		return map;
	}
}
