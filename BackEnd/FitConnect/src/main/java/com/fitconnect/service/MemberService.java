package com.fitconnect.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.fitconnect.dto.MemberDto;

@Service
public interface MemberService {
	public MemberDto addMember(MemberDto dto);
	public void updateMemberInfo(MemberDto memberDto);
	public void updateMemberPlan(MemberDto memberDto);
	public void updateMemberTrainer(MemberDto memberDto);
	public void deleteMember(String userName);
	public MemberDto selectOne(String userName);
	public List<MemberDto> selectList();
}