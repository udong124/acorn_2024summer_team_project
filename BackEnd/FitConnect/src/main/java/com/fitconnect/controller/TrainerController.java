package com.fitconnect.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Delete;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fitconnect.dto.MemberDto;
import com.fitconnect.dto.TrainerDto;
import com.fitconnect.service.TrainerService;

import io.swagger.v3.oas.annotations.parameters.RequestBody;

@RestController
public class TrainerController {
	
	@Autowired private TrainerService service;
	
	//회원의 정보를 추가하는 API 
	@PostMapping ("/trainer/setup")
	public TrainerDto trainerSetup(@RequestBody TrainerDto dto) {
		return service.addTrainer(dto);
	}
		
	//회원의 정보를 수정(업데이트) 하는 API
	@PatchMapping("/trianer/update/info")
	public void trainerUpdateInfo(@RequestBody TrainerDto dto) {
		service.updateTrainerInfo(dto);
	}

	@PatchMapping("/trianer/update/gyminfo")
	public void trainerUpdateGymInfo(@RequestBody TrainerDto dto) {
		service.updateTrainerGymInfo(dto);
	}

	//회원의 정보를 삭제하는 API
	@DeleteMapping("/trainer/delete")
	public Map<String, Object> trainerDelete(String userName){
		service.deleteTrainer(userName);
		Map<String, Object> map=new HashMap<>();
		map.put("isSuccess", true);
		return map;
	}

	@GetMapping("/trainer")
	public TrainerDto getTrainer(String userName) {
		return service.selectOne(userName);
	}

	@GetMapping("/trainer/list")
	public List<TrainerDto> getTrainerList(){
		return service.selectList();
	}
	
}