package com.fitconnect.repository;

import com.fitconnect.dto.UserDto;

public interface UserDao {
	public UserDto getData(String userName);
	public UserDto getDataByNum(int id);
	public boolean insert(UserDto dto);
	public boolean updateRole(UserDto dto);
	public boolean updatePwd(UserDto dto);
	public boolean updateInfo(UserDto dto);
	public boolean delete(String userName);
}
