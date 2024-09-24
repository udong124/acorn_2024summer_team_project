package com.fitconnect.repository;

import com.fitconnect.dto.UserDto;

public interface UserDao {
	public UserDto getData(String userName);
	public UserDto getDataByNum(int id);
	public void insert(UserDto dto);
	public void updateRole(UserDto dto);
	public void updatePwd(UserDto dto);
	public void updateInfo(UserDto dto);
	public void delete(String userName);
}
