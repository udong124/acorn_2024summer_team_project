package com.fitconnect.repository;

import java.util.List;

import com.fitconnect.dto.memberCalendarDto;


public interface memberCalendarDao {
	//로그인된 사용자의 캘린더 전체 조회
	public List<memberCalendarDto> getList(int user_num);
	
	//로그인된 사용자가 선택한 캘린더 정보 하나를 조회
	public memberCalendarDto getData(memberCalendarDto dto);
	
	//캘린더 정보 등록 ( 날짜, 메모만 수기로 입력하고 member_num 은 로그인된 사용자 아이디로 가져옴)
	public boolean insert(memberCalendarDto dto);
	
	//선택한 캘린더 정보 수정
	public boolean update(memberCalendarDto dto);
	
	//선택한 캘린더 정보 삭제
	public boolean delete(int member_num, int m_calendar_id);

}
