package com.fitconnect.repository;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.fitconnect.dto.UserDto;

@Repository
public class UserDaoImpl implements UserDao{
	@Autowired private SqlSession session;
	
	@Override
	public UserDto getData(String userName) {
		return session.selectOne("user.getData", userName);
	}

	@Override
	public void insert(UserDto dto) {
		session.insert("user.insert", dto);
	}

	@Override
	public void updatePwd(UserDto dto) {
		session.update("user.updatePwd", dto);
	}

	@Override
	public void updateInfo(UserDto dto) {
		session.update("user.updateInfo", dto);
	}

	@Override
	public void updateRole(UserDto dto) {
		session.update("user.updateRole", dto);
	}

	@Override
	public void delete(String userName) {
		session.delete("user.delete", userName);
	}

}
