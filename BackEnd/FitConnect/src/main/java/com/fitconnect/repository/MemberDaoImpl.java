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
	public void insert(MemberDto dto) {
		session.insert("member.insert", dto);
	}

	@Override
	public void updateInfo(MemberDto dto) {
		session.update("member.updateInfo", dto);
	}

	@Override
	public void updatePlan(MemberDto dto) {
		session.update("member.updatePlan", dto);
	}

	@Override
	public void updateTrainer(MemberDto dto) {
		session.update("member.updateTrainer", dto);
	}

	@Override
	public void delete(int member_num) {
		session.delete("member.delete", member_num);
	}

}
