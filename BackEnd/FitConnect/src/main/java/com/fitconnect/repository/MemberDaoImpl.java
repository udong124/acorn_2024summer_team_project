package com.fitconnect.repository;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.fitconnect.dto.MemberDto;

@Repository
public class MemberDaoImpl implements MemberDao{
	
	@Autowired private SqlSession session;

	@Override
	public List<MemberDto> getList() {
		return session.selectList("member.getList");
	}

	@Override
	public MemberDto getData(int member_num) {
		return session.selectOne("member.getData", member_num);
	}

	@Override
	public boolean insert(MemberDto dto) {
		int rowCount = session.insert("member.insert", dto);
		if(rowCount>0) {
			return true;
		}else{
			return false;
		}
	}

	@Override
	public boolean updateInfo(MemberDto dto) {
		int rowCount = session.update("member.updateInfo", dto);
		if(rowCount>0) {
			return true;
		}else{
			return false;
		}
	}

	@Override
	public boolean updatePlan(MemberDto dto) {
		int rowCount = session.update("member.updatePlan", dto);
		if(rowCount>0) {
			return true;
		}else{
			return false;
		}
	}

	@Override
	public boolean updateTrainer(MemberDto dto) {
		int rowCount = session.update("member.updateTrainer", dto);
		if(rowCount>0) {
			return true;
		}else{
			return false;
		}
	}

	@Override
	public boolean delete(int member_num) {
		int rowCount = session.delete("member.delete", member_num);
		if(rowCount>0) {
			return true;
		}else{
			return false;
		}
	}

}
