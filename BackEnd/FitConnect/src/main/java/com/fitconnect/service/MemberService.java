package com.fitconnect.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.fitconnect.dto.MemberDto;

@Service
public interface MemberService {
	public boolean addMember(MemberDto dto);
	public boolean updateMemberInfo(MemberDto memberDto);
	public boolean updateMemberPlan(MemberDto memberDto);
	public boolean updateMemberTrainer(MemberDto memberDto);
	public boolean deleteMember(String userName);
	public MemberDto selectOne(String userName);
	public List<MemberDto> selectList();
}