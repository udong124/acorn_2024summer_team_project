package com.fitconnect.controller;

import java.io.File;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fitconnect.dto.ChatRoomDto;
import com.fitconnect.dto.UserDto;
import com.fitconnect.repository.UserDao;
import com.fitconnect.service.MessageService;
import com.fitconnect.service.UserService;
import com.fitconnect.util.JwtUtil;

@RestController
public class UserController {
	@Autowired
	private JwtUtil jwtUtil;
	
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private UserService userService;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	// react js 를 테스트 하기 위한 코딩
	@Autowired
	private AuthenticationManager authManager;
	
	@Autowired 
	private MessageService MsgService;
	
	@Value("${file.location}")
	private String fileLocation;
	
	@GetMapping("/")
	public String home() {
		return "home";
	}
	
	/**********************************************************************
    * <PRE> * 메소드 정보 *
    * 1. MethodName   : auth
    * 2. ClassName      : UserController
    * 3. 작성자         : minji
    * 4. 작성일         : 2024. 9. 28. 오후 5:32:41
    * 5. 설명         : 사용자의 인증을 처리하고 JWT 토큰을 발급하는 역할의 메소드. 
    * </PRE>
    *       @return String (인증에 성공하면 JWT 토큰을 반환한다) 
    *       @param dto (userdto에 사용자의 인증 정보를 포함한다) 
    *       @throws Exception (인증에 실패할 시 예외 경우를 발생시킨다) 
   **********************************************************************/
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
		String role = userDao.getData(userName).getRole();
		String name = userDao.getData(userName).getName();
		String token=jwtUtil.generateToken(userName, id, role, name);
		return "Bearer+"+token;
	}
	
   /**********************************************************************
    * <PRE> * 메소드 정보 *
    * 1. MethodName   : signup
    * 2. ClassName      : UserController
    * 3. 작성자         : minji
    * 4. 작성일         : 2024. 9. 28. 오후 6:03:35
    * 5. 설명         : 새로운 사용자를 등록하는 메소드. 비밀번호를 암호화 하여 DB에 저장, 성공 여부 반환.
    * </PRE>
    *       @return Map<String,Object>
    *       @param dto
   **********************************************************************/
	@PostMapping("/user")
	public Map<String, Object> signup(@RequestBody UserDto dto) {
		String rawPassword = dto.getPassword();
		String encPassword = passwordEncoder.encode(rawPassword);
		dto.setPassword(encPassword);
		Map<String, Object> map=new HashMap<>();
		if(userDao.getData(dto.getUserName()) != null) {
			map.put("isSuccess", false);
			map.put("id", 0);
		}
		else {
			map.put("isSuccess", userDao.insert(dto));
			int id = userDao.getData(dto.getUserName()).getId();
			map.put("id", id);
		}
		return map;
	}

   /**********************************************************************
    * <PRE> * 메소드 정보 *
    * 1. MethodName   : delete
    * 2. ClassName      : UserController
    * 3. 작성자         : minji
    * 4. 작성일         : 2024. 9. 28. 오후 6:13:29
    * 5. 설명         :현재 인증 되어있는 사용자의 계정을 삭제하는 메소드
    * </PRE>
    *       @return Map<String,Object>
   **********************************************************************/
	@DeleteMapping("/user")
	public Map<String, Object> delete() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userName = authentication.getName();
		Map<String, Object> map=new HashMap<>();
		if(userDao.getData(userName) == null) {
			map.put("isSuccess", false);
		}
		else {
			map.put("isSuccess", userDao.delete(userName));
		}
		return map;
	}

   /**********************************************************************
    * <PRE> * 메소드 정보 *
    * 1. MethodName   : getUser
    * 2. ClassName      : UserController
    * 3. 작성자         : minji
    * 4. 작성일         : 2024. 9. 30. 오전 11:57:09
    * 5. 설명         : 인증된 사용자의 정보를 반환하는 메소드. 인증된 사용자의 정보를 기반으로 
    * 데이터 베이스에서 해당 사용자의 정보를 조회 후 반환함. 
    * </PRE>
    *       @return UserDto
   **********************************************************************/
	@GetMapping("/user")
	public UserDto getUser() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userName = authentication.getName();
        return userDao.getData(userName);
	}

   /**********************************************************************
    * <PRE> * 메소드 정보 *
    * 1. MethodName   : updateInfo
    * 2. ClassName      : UserController
    * 3. 작성자         : minji
    * 4. 작성일         : 2024. 9. 30. 오전 11:59:30
    * 5. 설명         : 인증된 사용자의 정보를 업데이트하는 메소드. 사용자의 프로필 이미지와
    * 기타 정보를 업데이트하고 업데이트된 사용자 정보를 반환한다. 
    * </PRE>
    *       @return UserDto
    *       @param dto
   **********************************************************************/
	@PatchMapping(value="/user/update/info", consumes = {MediaType. APPLICATION_JSON_VALUE, MediaType. MULTIPART_FORM_DATA_VALUE})
	public Map<String, Object> updateInfo(@ModelAttribute UserDto dto) {

		System.out.println(fileLocation);
		if(dto.getImage() != null) {
			MultipartFile image = dto.getImage();
		
			String profile=UUID.randomUUID().toString();
			//저장할 파일의 전체 경로 구성하기 
			String filePath=fileLocation+File.separator+profile;
			System.out.println(filePath);
			try {
				//업로드된 파일을 이동시킬 목적지 File 객체
				File f=new File(filePath);
				image.transferTo(f);
				
			}catch(Exception e) {
				e.printStackTrace();
			}
			dto.setProfile(profile);
		}
		
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userName = authentication.getName();
        dto.setUserName(userName);
		
		boolean isSuccess = userDao.updateInfo(dto);

		return Map.of("isSuccess", isSuccess);
	}
	
   /**********************************************************************
    * <PRE> * 메소드 정보 *
    * 1. MethodName   : updatePassword
    * 2. ClassName      : UserController
    * 3. 작성자         : minji
    * 4. 작성일         : 2024. 9. 30. 오후 12:05:46
    * 5. 설명         : 현재 인증된 사용자의 비밀번호를 업데이트하는 메소드. 사용자가 입력한
    * 새 비밀번호를 암호화하여 데이터베이스에 저장 >> 업데이트 된 정보를 반환
    * </PRE>
    *       @return UserDto
    *       @param dto
   **********************************************************************/
	@PatchMapping("/user/update/password")
	public Map<String, Object> updatePassword(@RequestBody UserDto dto) {
		String rawPassword = dto.getNewPassword();
		String encPassword = passwordEncoder.encode(rawPassword);
		dto.setPassword(encPassword);
		boolean isSuccess = userDao.updatePwd(dto);
		dto.setNewPassword(null);
		return Map.of("isSuccess", isSuccess);
	}
	
   /**********************************************************************
    * <PRE> * 메소드 정보 *
    * 1. MethodName   : updateRoleAdmin
    * 2. ClassName      : UserController
    * 3. 작성자         : minji
    * 4. 작성일         : 2024. 9. 30. 오후 12:13:35
    * 5. 설명         : 사용자의 역할을 업데이트하는 메소드
    * (ADMIN, MEMBER, TRAINER 중 하나의 경우) 셋 중 아무것도 해당되지 않을 경우 FALSE.
    * </PRE>
    *       @return UserDto
    *       @param dto
   **********************************************************************/
	@PatchMapping("/user/update/role")
	public Map<String, Object> updateRoleAdmin(@RequestBody UserDto dto) {
		String role = dto.getRole();
		boolean isSuccess;
		if(role.equals("ADMIN") || role.equals("MEMBER") || role.equals("TRAINER")) {
			isSuccess = userDao.updateRole(dto);
		}
		else {
			dto.setRole("USER");
			isSuccess = userDao.updateRole(dto);
		}
		return Map.of("isSuccess", isSuccess);
	}
	
	//경로 변수에 전달되는 입력한 userName 이 사용가능한지 여부를 json 으로 응답하는 메소드 
	@GetMapping("/user/check/{userName}")
	public Map<String, Object> checkUserName(@PathVariable("userName") String userName){
		
		return Map.of("canUse", userService.canUse(userName));
	}
}
