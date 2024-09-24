package com.fitconnect.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.fitconnect.dto.MemberDto;
import com.fitconnect.dto.TrainerDto;
import com.fitconnect.repository.UserDao;
import com.fitconnect.service.TrainerService;

@RestController
public class TrainerController {
	
	@Autowired private UserDao userDao;
	
	@Autowired private TrainerService service;
	
	@GetMapping("/trainer/userinfo")
	public Map<String, Object> trainerGetUserInfo() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userName = authentication.getName();
		return service.selectOneUserInfo(userName);
	}
	
	//회원의 정보를 추가하는 API 
	@PostMapping ("/trainer")
	public TrainerDto trainerSignUp(@RequestBody TrainerDto dto) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userName = authentication.getName();
        if(userDao.getData(userName).getId() != dto.getTrainer_num()) {
        	return null;
        }
		return service.addTrainer(dto);
	}

	//회원의 정보를 삭제하는 API
	@DeleteMapping("/trainer")
	public Map<String, Object> trainerDelete(){
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userName = authentication.getName();
		service.deleteTrainer(userName);
		Map<String, Object> map=new HashMap<>();
		map.put("isSuccess", true);
		return map;
	}

	@GetMapping("/trainer")
	public TrainerDto getTrainer() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userName = authentication.getName();
		return service.selectOne(userName);
	}
		
	//회원의 정보를 수정(업데이트) 하는 API
	@PatchMapping("/trainer/update/info")
	public void trainerUpdateInfo(@RequestBody TrainerDto dto) {
		service.updateTrainerInfo(dto);
	}

	@PatchMapping("/trainer/update/gyminfo")
	public void trainerUpdateGymInfo(@RequestBody TrainerDto dto) {
		service.updateTrainerGymInfo(dto);
	}

	@GetMapping("/trainer/list")
	public List<TrainerDto> getTrainerList(){
		return service.selectList();
	}

	@GetMapping("/trainer/list/member")
	public List<MemberDto> getMemberList(){
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userName = authentication.getName();
        int id = userDao.getData(userName).getId();
		return service.selectTrainerMemberList(id);
	}
}