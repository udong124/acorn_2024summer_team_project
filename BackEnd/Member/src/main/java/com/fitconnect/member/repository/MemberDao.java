package com.fitconnect.member.repository;

import java.util.List;

import com.fitconnect.dto.UserDto
import com.fitconnect.member.memberset.MemberDto;



public interface MemberDao {
	
	public void create(MemberDto dto);
	//특정 ID로 데이터를 조회
	public UserDto getData(int UserNum);
	public List<MemberDto> getList(MemberDto dto);
	public void update (MemberDto dto);
	public void delete (int memberNum);
	// public List<TrainerDto> getList2(TrainerDto dto);
	// 트레이너 연동 기능과 크게 연관이 없어 목록 조회를 일단 제외시킴 
	
	//public boolean trainerLinked(int memberNum);
	//멤버와 트레이너의 연동 확인 (추후 추가할지 말지 결정) 
	public void linkTrainer(int memberNum, int trainerNum);
	//멤버와 트레이너(유저아이디)를 연동
	
	

}