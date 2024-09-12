package com.fitconnect.handler;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.fitconnect.dto.UserDto;
import com.fitconnect.repository.UserDao;
import com.fitconnect.util.JwtUtil;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class AuthSuccessHandler extends SimpleUrlAuthenticationSuccessHandler{
	//Jwt 토큰 유틸
	@Autowired
	private UserDao dao;
	
	@Autowired 
	private JwtUtil jwtUtil;
	
	//jwt 를 쿠키로 저장할때 쿠키의 이름
	@Value("${jwt.name}")
	private String jwtName;
	//쿠키 유지시간
	@Value("${jwt.cookie.expiration}")
	private int cookieExpiration;
		
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
    	//여기 까지 실행순서가 넘어오면 인증을 통과 했으므로 토큰을 발급해서 응답한다.
    	String userName = authentication.getName();
    	UserDto dto = dao.getData(userName);
    	int id = dto.getId();
		String jwtToken="Bearer+"+jwtUtil.generateToken(userName, id);
//		response.addHeader(jwtName, jwtToken);
		response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write("{\"token\": \"" + jwtToken + "\"}");
        response.getWriter().flush();
    }
}
