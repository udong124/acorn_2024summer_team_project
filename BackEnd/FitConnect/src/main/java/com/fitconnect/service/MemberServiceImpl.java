package com.fitconnect.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fitconnect.dto.MemberDto;
import com.fitconnect.repository.MemberDao;
import com.fitconnect.repository.UserDao;

@Service
public class MemberServiceImpl implements MemberService{

	@Autowired
	UserDao userDao;
	
	@Autowired
	MemberDao memberDao;
	
	@Override
	public MemberDto addMember(MemberDto dto) {
		memberDao.insert(dto);
		return memberDao.getData(dto.getMember_num());
	}

	@Override
	public void updateMemberInfo(MemberDto memberDto) {
		memberDao.updateInfo(memberDto);
	}

	@Override
	public void updateMemberPlan(MemberDto memberDto) {
		memberDao.updatePlan(memberDto);
	}

	@Override
	public void updateMemberTrainer(MemberDto memberDto) {
		memberDao.updateTrainer(memberDto);
	}

	@Override
	public void deleteMember(String userName) {
		int member_num = userDao.getData(userName).getId();
		memberDao.delete(member_num);
	}

	@Override
	public MemberDto selectOne(String userName) {
		int member_num = userDao.getData(userName).getId();
		return memberDao.getData(member_num);
	}

	@Override
	public List<MemberDto> selectList() {
		return memberDao.getList();
	}

}