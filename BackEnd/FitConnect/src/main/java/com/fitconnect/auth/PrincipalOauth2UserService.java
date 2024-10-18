package com.fitconnect.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.fitconnect.dto.UserDto;
import com.fitconnect.repository.UserDao;

@Service
public class PrincipalOauth2UserService extends DefaultOAuth2UserService{
	
	@Autowired
	private UserDao dao;
	
	@Override
	public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
		System.out.println("getClientRegistration: "+userRequest.getClientRegistration());
		System.out.println("getAccessToken: "+userRequest.getAccessToken().getTokenValue());
		// sub: 구글의 PK =>userName (google_(sub))
		// password = 
		// email = (email)
		
		OAuth2User oauth2User = super.loadUser(userRequest);
		if (oauth2User == null) {
            throw new OAuth2AuthenticationException("OAuth2User is null");
        }
		System.out.println("getAttributes: "+oauth2User.getAttributes());

		String provider = userRequest.getClientRegistration().getRegistrationId(); //google
		String providerid = oauth2User.getAttribute("sub");
		String userName = (provider+"_"+providerid); // google_192848124912849248
		String password = userName;
		String name = oauth2User.getAttribute("name");
		String email = oauth2User.getAttribute("email");
		String profile = oauth2User.getAttribute("picture");
		String role = "USER";

		UserDto dto = dao.getData(userName);
		System.out.println("dto: "+dto);
		if(dto == null) {
			UserDto newDto = UserDto.builder()
					.userName(userName)
					.password(password)
					.name(name)
					.email(email)
					.profile(profile)
					.role(role)
					.provider(provider)
					.providerid(providerid)
					.build();
			dao.insert(newDto);
			System.out.println("newDto: "+newDto);
			return new PrincipalDetails(newDto, oauth2User.getAttributes());
		}
		return new PrincipalDetails(dto, oauth2User.getAttributes());
	}
}
