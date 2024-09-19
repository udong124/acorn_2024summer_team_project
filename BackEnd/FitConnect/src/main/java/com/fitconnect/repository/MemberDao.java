package com.fitconnect.repository;

import java.util.List;

import com.fitconnect.dto.MemberDto;

public interface MemberDao {
	public List<MemberDto> getList();
	public MemberDto getData(int member_num);
	public void insert(MemberDto dto);
	public void updateInfo(MemberDto dto);
	public void updatePlan(MemberDto dto);
	public void updateTrainer(MemberDto dto);
	public void delete (int member_num);
}