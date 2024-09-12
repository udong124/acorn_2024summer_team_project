package com.fitconnect.member.repository;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.fitconnect.dto.UserDto;
import com.fitconnect.member.memberset.MemberDto;


@Repository
public class MemberDaoImpl implements MemberDao{
	
	@Autowired private SqlSession session;

	@Override
	public void create(MemberDto dto) {
		
		session.insert("member.insert", dto);
		
	}

	@Override
	public UserDto getData(int userNum) {
		
		return session.selectOne("member.getData", userNum);
	}
	@Override
	public List<MemberDto> getList(MemberDto dto) {
		
		return session.selectList("member.getList", dto);
	}

	@Override
	public void update(MemberDto dto) {
		
		session.update("member.update", dto);
	}

	@Override
	public void delete(int memberNum) {
		
		session.delete("member.delete", memberNum);
		
	}
	
	//연동 세션을 어떻게 구성해야할지 잘 모르겠습니다... 
	@Override
	public void linkTrainer(int memberNum, int trainerNum) {
		// TODO Auto-generated method stub
		
	}
	
	
	/*
	 * 일단은 제외시켜둔 기능 
	 * 
	@Override
	public List<TrainerDto> getList2(TrainerDto dto) {
		
		return session.selectList("trainer.getList", dto);
	}
	
	
	@Override
	public boolean trainerLinked(int memberNum) {
		// TODO Auto-generated method stub
		return false;
	}
	*/

}
