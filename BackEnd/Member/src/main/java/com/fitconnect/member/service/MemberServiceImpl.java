package com.fitconnect.member.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fitconnect.member.memberset.MemberDto;
import com.fitconnect.member.repository.MemberDao;
import com.fitconnect.trainer.repositroy.TrainerDao;

@Service
public class MemberServiceImpl implements MemberService{

	@Autowired private MemberDao memberDao;
	@Autowired private TrainerDao trainerDao;
	
	
	@Override
	public MemberDto createMember (MemberDto dto) {
		//memberDao의 create 메소드를 호출하여 데이터 베이스에 추가한다
		memberDao.create(dto);
		return dto;
		
	}

	@Override
	public void updateMember(MemberDto dto) {
		//update 메소드를 호출하여 멤버 정보 업데이트 
		memberDao.update(dto);
		
	}

	@Override
	public void deleteMember(int memberNum) {
		//delete 메소드를 호출하여 멤버 정보 삭제
		memberDao.delete(memberNum);
		
	}

	@Override
	public void linkTrainerToMember(int memberNum, int trainerNum) {
		 
		memberDao.linkTrainer(memberNum, trainerNum);
	}

	@Override
	public void updateMemberInfo(MemberDto memberDto) {
		
		memberDao.update(memberDto);
		
	}


}