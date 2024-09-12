package com.fitconnect.member.service;

import org.springframework.stereotype.Service;

import com.fitconnect.member.memberset.MemberDto;

@Service
public interface MemberService {
	
		public MemberDto createMember(MemberDto dto);
		//사용자 추가 메소드
		public void updateMember(MemberDto dto);
		//멤버 수정 메소드
		public void deleteMember(int memberNum);
		//멤버 삭제 메소드 
		public void linkTrainerToMember(int memberNum, int trainerNum);
		//멤버와 트레이너 연동
		public void updateMemberInfo(MemberDto memberDto);
		//멤버 설정 저장 메소드
	
}