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
		/*
		 * mapper's namespace => user
		 * sql's id => getData
		 * parameterType => String
		 * resultType => UserDto
		 */
		return session.selectOne("user.getData", userName);
	}

	@Override
	public void insert(UserDto dto) {
		/*
		 * mapper's namespace => user
		 * sql's id => insert
		 * parameterType => UserDto
		 * resultType => select 가 아니기 때문에 없다
		 */
		session.insert("user.insert", dto);
	}

	@Override
	public void updatePwd(UserDto dto) {
		/*
		 * mapper's namespace => user
		 * sql's id => updatePwd
		 * parameterType => UserDto
		 * resultType => select 가 아니기 때문에 없다
		 */
		session.update("user.updatePwd", dto);
	}

	@Override
	public void updateInfo(UserDto dto) {
		/*
		 * mapper's namespace => user
		 * sql's id => update
		 * parameterType => UserDto
		 * resultType => select 가 아니기 때문에 없다
		 */
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
