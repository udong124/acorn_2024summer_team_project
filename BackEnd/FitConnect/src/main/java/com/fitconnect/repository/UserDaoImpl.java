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
	public UserDto getDataByNum(int id) {
		return session.selectOne("user.getDataByNum", id);
	}

	@Override
	public boolean insert(UserDto dto) {
		int rowCount = session.insert("user.insert", dto);
		if(rowCount>0) {
			return true;
		}else{
			return false;
		}
	}

	@Override
	public boolean updatePwd(UserDto dto) {
		int rowCount = session.update("user.updatePwd", dto);
		if(rowCount>0) {
			return true;
		}else{
			return false;
		}
	}

	@Override
	public boolean updateInfo(UserDto dto) {
		int rowCount = session.update("user.updateInfo", dto);
		if(rowCount>0) {
			return true;
		}else{
			return false;
		}
	}

	@Override
	public boolean updateRole(UserDto dto) {
		int rowCount = session.update("user.updateRole", dto);
		if(rowCount>0) {
			return true;
		}else{
			return false;
		}
	}

	@Override
	public boolean delete(String userName) {
		int rowCount = session.delete("user.delete", userName);
		if(rowCount>0) {
			return true;
		}else{
			return false;
		}
	}

}