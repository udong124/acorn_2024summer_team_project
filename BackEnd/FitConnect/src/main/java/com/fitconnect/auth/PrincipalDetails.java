package com.fitconnect.auth;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Map;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;

import com.fitconnect.dto.UserDto;

import lombok.Data;

@Data
public class PrincipalDetails implements UserDetails, OAuth2User{

	private UserDto dto;
	private Map<String, Object> attributes;
	
	public PrincipalDetails(UserDto dto) {
		this.dto = dto;
	}

	public PrincipalDetails(UserDto dto, Map<String, Object> attributes) {
		this.dto = dto;
		this.attributes = attributes;
	}
	
	//해당 User의 권한을 리턴하는 곳
	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		Collection<GrantedAuthority> collect = new ArrayList<GrantedAuthority>();
		collect.add(new GrantedAuthority() {
			
			@Override
			public String getAuthority() {
				return dto.getRole();
			}
		});
		return collect;
	}

	@Override
	public String getPassword() {
		return dto.getPassword();
	}

	@Override
	public String getUsername() {
		return dto.getUserName();
	}

	@Override
	public Map<String, Object> getAttributes() {
		return attributes;
	}

	@Override
	public String getName() {
		return (String) attributes.get("sub");
	}

	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
		return true;
	}

	// isEnable, isCredentialIsNonExpired 등등 설정 가능
}
