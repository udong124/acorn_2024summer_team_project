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

import com.fitconnect.auth.PrincipalDetails;
import com.fitconnect.dto.MemberDto;
import com.fitconnect.dto.TrainerDto;
import com.fitconnect.dto.UserDto;
import com.fitconnect.repository.UserDao;
import com.fitconnect.service.MessageService;
import com.fitconnect.service.TrainerService;

@RestController
public class TrainerController {
	
	@Autowired private UserDao userDao;
	
	@Autowired private TrainerService service;
	
	@Autowired private MessageService MsgService;
	
	@GetMapping("/trainer/userinfo")
	public Map<String, Object> trainerGetUserInfo() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userName = authentication.getName();
		return service.selectOneUserInfo(userName);
	}
	
	//회원의 정보를 추가하는 API 
	@PostMapping ("/trainer")
	public Map<String, Object> trainerSignUp(@RequestBody TrainerDto dto) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userName = authentication.getName();
        if(userDao.getData(userName).getId() != dto.getTrainer_num()) {
        	return Map.of("isSuccess", false);
        }
		boolean isSuccess = service.addTrainer(dto);
		return Map.of("isSuccess", isSuccess);
	}

	//회원의 정보를 삭제하는 API
	@DeleteMapping("/trainer")
	public Map<String, Object> trainerDelete(){
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userName = authentication.getName();
        UserDto userDto = ((PrincipalDetails)authentication.getPrincipal()).getDto();
        MsgService.deleteTrainerChat(userDto.getId());

        boolean isSuccess =  service.deleteTrainer(userName);
		
        return Map.of("isSuccess", isSuccess);
	}

	@GetMapping("/trainer")
	public TrainerDto getTrainer() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userName = authentication.getName();
		return service.selectOne(userName);
	}
		
	//회원의 정보를 수정(업데이트) 하는 API
	@PatchMapping("/trainer/update/info")
	public Map<String, Object> trainerUpdateInfo(@RequestBody TrainerDto dto) {
		boolean isSuccess = service.updateTrainerInfo(dto);
		return Map.of("isSuccess", isSuccess);
	}

	@PatchMapping("/trainer/update/gyminfo")
	public Map<String, Object> trainerUpdateGymInfo(@RequestBody TrainerDto dto) {
		boolean isSuccess = service.updateTrainerGymInfo(dto);
		return Map.of("isSuccess", isSuccess);
	}

	@GetMapping("/trainer/list")
	public List<TrainerDto> getTrainerList(){
		return service.selectList();
	}

	@GetMapping("/trainer/list/member")
	public List<Map<String, Object>> getMemberList(){
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userName = authentication.getName();
        int id = userDao.getData(userName).getId();
		return service.selectTrainerMemberList(id);
	}
}