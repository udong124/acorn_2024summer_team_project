package com.fitconnect.auth;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.fitconnect.dto.UserDto;
import com.fitconnect.repository.UserDao;

//시큐리티 설정에서 loginProcessingUrl("/login");
// /login 요청이 오면 자동으로 UserDetailsService 타입으로 loC되어있는 loadUserByUsername 함수가 실행
@Service
public class PrincipalDetailsService implements UserDetailsService{

	@Autowired
	private UserDao dao;
	
	//userName 변수명 통일해야 자동 연결, 다르면 config에서 다시 설정해야됨
	//시큐리티 session(내부 Authentication(내부 UserDetails))
	@Override
	public UserDetails loadUserByUsername(String userName) throws UsernameNotFoundException {

		//1. form 에 입력한 userName 을 이용해서 사용자의 자세한 정보를 얻어온다.
		UserDto dto = dao.getData(userName);
		//만일 저장된 userName 이 없다면
		if(dto == null) {
			//예외를 발생시킨다
			throw new UsernameNotFoundException("존재하지 않는 사용자 입니다");
		}

		//있다면 해당정보를 이용해서 UserDetails 객체를 만들어서 리턴해 주어야 한다.

		//권한 목록을 List 에 담아서  (지금은 1개 이지만)
		List<GrantedAuthority> authList=new ArrayList<>();
		//Authority 는 접두어로 "ROLE_" 가 붙어 있어야 한다.
		authList.add(new SimpleGrantedAuthority("ROLE_"+dto.getRole()));
		
		//UserDetails 객체를 생성해서 
//		UserDetails ud=new User(dto.getUserName(), dto.getPassword(), authList);
		//리턴해준다.
		return new PrincipalDetails(dto);
	}

}
