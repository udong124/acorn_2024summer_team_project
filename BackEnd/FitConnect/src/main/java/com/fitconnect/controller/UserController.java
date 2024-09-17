package com.fitconnect.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.fitconnect.dto.UserDto;
import com.fitconnect.repository.UserDao;
import com.fitconnect.util.JwtUtil;

@RestController
public class UserController {
	@Autowired
	private JwtUtil jwtUtil;
	
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	// react js 를 테스트 하기 위한 코딩
	@Autowired
	private AuthenticationManager authManager;
	
	@GetMapping("/")
	public String home() {
		return "home";
	}
	
	@PostMapping("/auth")
	public String auth(@RequestBody UserDto dto ) throws Exception {
		try {
			//입력한 username 과 password 를 인증토큰 객체에 담아서 
			UsernamePasswordAuthenticationToken authToken=
					new UsernamePasswordAuthenticationToken(dto.getUserName(), dto.getPassword());	
			//인증 메니저 객체를 이용해서 인증을 진행한다 
			authManager.authenticate(authToken);
		}catch(Exception e) {
			//예외가 발생하면 인증실패(아이디 혹은 비밀번호 틀림 등등...)
			e.printStackTrace();
			throw new Exception("아이디 혹은 비밀번호가 틀려요!");
		}
		//예외가 발생하지 않고 여기까지 실행 된다면 인증을 통과 한 것이다. 토큰을 발급해서 응답한다.
		String userName = dto.getUserName();
		int id = userDao.getData(userName).getId();
		String token=jwtUtil.generateToken(userName, id);
		return "Bearer+"+token;
	}
	
	@PostMapping("/signup")
	public boolean signup(@RequestBody UserDto dto) {
		//System.out.println(dto);
		String rawPassword = dto.getPassword();
		String encPassword = passwordEncoder.encode(rawPassword);
		dto.setPassword(encPassword);
		if(userDao.getData(dto.getUserName()) != null) {
			return false;
		}
		userDao.insert(dto);
		return true;
	}

	@PostMapping("/update/info")
	public UserDto updateInfo(@RequestBody UserDto dto) {
		userDao.updateInfo(dto);
		return dto;
	}
	
	@PostMapping("/update/password")
	public UserDto updatePassword(@RequestBody UserDto dto) {
		//System.out.println(dto);
		String rawPassword = dto.getNewPassword();
		String encPassword = passwordEncoder.encode(rawPassword);
		dto.setPassword(encPassword);
		userDao.updatePwd(dto);
		return dto;
	}
	
	@PostMapping("/update/role/admin")
	public UserDto updateRoleAdmin(@RequestBody UserDto dto) {
		//System.out.println(dto);
		dto.setRole("ADMIN");
		userDao.updateRole(dto);
		return dto;
	}
	
	@PostMapping("/update/role/member")
	public UserDto updateRoleMember(@RequestBody UserDto dto) {
		//System.out.println(dto);
		dto.setRole("MEMBER");
		userDao.updateRole(dto);
		return dto;
	}

	@PostMapping("/update/role/trainer")
	public UserDto updateRoleTrainer(@RequestBody UserDto dto) {
		//System.out.println(dto);
		dto.setRole("TRAINER");
		userDao.updateRole(dto);
		return dto;
	}

	@PostMapping("/delete")
	public boolean delete(@RequestBody UserDto dto) {
		//System.out.println(dto);
		//보안기능 추가 필요?
		userDao.delete(dto.getUserName());
		return true;
	}

	
}
