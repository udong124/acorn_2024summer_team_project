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
	private UserDao userDao;
	
	@Autowired
	private MemberDao memberDao;
	
	@Override
	public boolean addMember(MemberDto dto) {
		boolean isSuccess = memberDao.insert(dto);
		return isSuccess;
	}

	@Override
	public boolean updateMemberInfo(MemberDto memberDto) {
		boolean isSuccess = memberDao.updateInfo(memberDto);
		return isSuccess;
	}

	@Override
	public boolean updateMemberPlan(MemberDto memberDto) {
		boolean isSuccess = memberDao.updatePlan(memberDto);
		return isSuccess;
	}

	@Override
	public boolean updateMemberTrainer(MemberDto memberDto) {
		boolean isSuccess =memberDao.updateTrainer(memberDto);
		return isSuccess;
	}

	@Override
	public boolean deleteMember(String userName) {
		int member_num = userDao.getData(userName).getId();
		boolean isSuccess = memberDao.delete(member_num);
		return isSuccess;
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