package com.fitconnect.repository;

import java.util.List;

import com.fitconnect.dto.MemberDto;

public interface MemberDao {
	public List<MemberDto> getList();
	public MemberDto getData(int member_num);
	public boolean insert(MemberDto dto);
	public boolean updateInfo(MemberDto dto);
	public boolean updatePlan(MemberDto dto);
	public boolean updateTrainer(MemberDto dto);
	public boolean delete (int member_num);
}