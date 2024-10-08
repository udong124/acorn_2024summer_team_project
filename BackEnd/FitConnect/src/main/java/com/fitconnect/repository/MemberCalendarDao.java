package com.fitconnect.repository;

import java.util.List;
import java.util.Map;

import com.fitconnect.dto.MemberCalendarDto;


public interface MemberCalendarDao {
	//로그인된 사용자의 캘린더 전체 조회
	public List<MemberCalendarDto> getList(int user_num);
	
	//로그인된 사용자가 선택한 캘린더 정보 하나를 조회
	public MemberCalendarDto getData(MemberCalendarDto dto);
	
	//캘린더 정보 등록 ( 날짜, 메모만 수기로 입력하고 member_num 은 로그인된 사용자 아이디로 가져옴)
	public boolean insert(MemberCalendarDto dto);
	
	//선택한 캘린더 정보 수정
	public boolean update(MemberCalendarDto dto);
	
	//선택한 캘린더 정보 삭제
	public boolean delete(int member_num, int m_calendar_id);

	//특정 멤버 캘린더 아이디 조회
	public boolean getCalendarId(String regdate);
	public int getMcalendarId(String regdate);
}
