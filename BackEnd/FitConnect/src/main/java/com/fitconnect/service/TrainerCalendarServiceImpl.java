package com.fitconnect.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.fitconnect.auth.PrincipalDetails;
import com.fitconnect.dto.ChatRoomDto;
import com.fitconnect.dto.DietJournalDto;
import com.fitconnect.dto.ExerciseJournalDto;
import com.fitconnect.dto.MemberDto;
import com.fitconnect.dto.TrainerCalendarDto;
import com.fitconnect.dto.UserDto;
import com.fitconnect.handler.AuthSuccessHandler;
import com.fitconnect.repository.MessageDao;
import com.fitconnect.repository.TrainerCalendarDao;

@Service
public class TrainerCalendarServiceImpl implements TrainerCalendarService  {

	@Autowired private TrainerCalendarDao calDao;
	
	@Autowired private MessageDao MsgDao;
	
	//트레이너 전체 캘린저 일정 리스트
	/**
	 * <PRE>
	 * 1. MethodName	: selectCalenList
	 * 2. ClassName		: TrainerCalendarServiceImpl
	 * 3. Commnet			: 로그인된 트레이너의 전체 캘린더 목록을 조회하는 메소드
	 * 4. 작성자				: songminjung
	 * 5. 작성일				: 2024. 9. 30. 오후 2:49:36
	 * </PRE>
	 * 		@return List<TrainerCalendarDto>
	 */
	@Override
	public List<TrainerCalendarDto> selectCalenList() {
		//토큰에 저장된 user_id을 user_id이라는 key 값에 담기
	    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
	    UserDto userDto = ((PrincipalDetails)authentication.getPrincipal()).getDto();
		return calDao.getCalenList(userDto.getId());
	}

	//트레이너의 특정 일자 일정
	/**
	 * <PRE>
	 * 1. MethodName	: selectCalenderOne
	 * 2. ClassName		: TrainerCalendarServiceImpl
	 * 3. Commnet			: 특정 트레이너의 특정 일자에 등록된 일정을 조회하는 메소드
	 * 4. 작성자				: songminjung
	 * 5. 작성일				: 2024. 9. 30. 오후 2:49:39
	 * </PRE>
	 * 		@param t_calendar_id
	 * 		@return TrainerCalendarDto
	 */
	@Override
	public TrainerCalendarDto selectCalenderOne(int t_calendar_id) {
		return calDao.getCalender(t_calendar_id);
	}

	//트레이너 일정 등록
	/**
	 * <PRE>
	 * 1. MethodName	: addSchedule
	 * 2. ClassName		: TrainerCalendarServiceImpl
	 * 3. Commnet			: 로그인 된 트레이너의 일정을 등록하는 메소드
	 * 4. 작성자				: songminjung
	 * 5. 작성일				: 2024. 9. 30. 오후 2:49:43
	 * </PRE>
	 * 		@param dto
	 * 		@return true or false
	 */
	@Override
	public boolean addSchedule(TrainerCalendarDto dto) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
	    UserDto userDto = ((PrincipalDetails)authentication.getPrincipal()).getDto();
		dto.setTrainer_num(userDto.getId());
		boolean isSuccess = calDao.insert(dto);
		return isSuccess;
	}

	//트레이너 일정 수정
	/**
	 * <PRE>
	 * 1. MethodName	: updateSchedule
	 * 2. ClassName		: TrainerCalendarServiceImpl
	 * 3. Commnet			: 등록된 일정을 수정하는 메소드
	 * 4. 작성자				: songminjung
	 * 5. 작성일				: 2024. 9. 30. 오후 2:49:45
	 * </PRE>
	 * 		@param dto
	 * 		@return true or false
	 */
	@Override
	public boolean updateSchedule(TrainerCalendarDto dto) {
		boolean isSuccess = calDao.update(dto);
		return isSuccess;
	}

	//트레이너 일정 삭제
	/**
	 * <PRE>
	 * 1. MethodName	: deleteSchedule
	 * 2. ClassName		: TrainerCalendarServiceImpl
	 * 3. Commnet			: t_calendar_id 와 member_num이 일치하는 특정 일정을 삭제하는 메소드
	 * 4. 작성자				: songminjung
	 * 5. 작성일				: 2024. 9. 30. 오후 2:49:48
	 * </PRE>
	 * 		@param dto
	 * 		@return true or false
	 */
	@Override
	public boolean deleteSchedule(TrainerCalendarDto dto) {
		dto.setT_calendar_id(dto.getT_calendar_id());
		dto.setMember_num(dto.getMember_num());
		boolean isSuccess = calDao.delete(dto);
		return isSuccess;
	}

	//트레이너와 연동된 회원 중 특정 회원 1명의 정보
	/**
	 * <PRE>
	 * 1. MethodName	: selectMemberOne
	 * 2. ClassName		: TrainerCalendarServiceImpl
	 * 3. Commnet			: 특정 트레이너와 연결된 특정 회원 1명의 정보를 조회하는 메소드
	 * 4. 작성자				: songminjung
	 * 5. 작성일				: 2024. 9. 30. 오후 2:49:50
	 * </PRE>
	 * 		@param member_num
	 * 		@return List<MemberDto>
	 */
	@Override
	public Map<String, Object> selectMemberOne(int member_num) {
		 
		
		return Map.of("dto", calDao.getMemberOne(member_num));
	}

	//트레이너와 연동된 모든 회원 리스트
	/**
	 * <PRE>
	 * 1. MethodName	: selectMemberList
	 * 2. ClassName		: TrainerCalendarServiceImpl
	 * 3. Commnet			: 로그인 된 트레이너와 연결된 모든 회원 목록을 조회하는 메소드
	 * 4. 작성자				: songminjung
	 * 5. 작성일				: 2024. 9. 30. 오후 2:49:52
	 * </PRE>
	 * 		@return List<MemberDto>
	 */
	@Override
	public List<MemberDto> selectMemberList() {
		//토큰에 저장된 user_num을 user_num이라는 key 값에 담기
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
	    UserDto userDto = ((PrincipalDetails)authentication.getPrincipal()).getDto();
		return calDao.getMemberList(userDto.getId());
	}

	/**
	 * <PRE>
	 * 1. MethodName	: disconnect
	 * 2. ClassName		: TrainerCalendarServiceImpl
	 * 3. Commnet			: 특정 트레이너와 연결된 특정 회원의 연결을 끊는 메소드
	 * 4. 작성자				: songminjung
	 * 5. 작성일				: 2024. 9. 30. 오후 2:49:56
	 * </PRE>
	 * 		@param member_num
	 * 		@return true or false
	 */
	@Override
	   public boolean disconnect(int member_num) {
	      //채팅방 삭제 추가
	      boolean isSuccess = calDao.disconnect(member_num);
	      
	       ChatRoomDto chatDto = MsgDao.getChatRoom(member_num);
	      
	       if(chatDto != null){
	          String topic = chatDto.getTopic();
	          MsgDao.deleteMsgAll(topic);
	          MsgDao.deleteChat(topic);
	       }
	       System.out.println(chatDto);

	      return isSuccess;
	   }

	/**
	 * <PRE>
	 * 1. MethodName	: disconnect
	 * 2. ClassName		: TrainerCalendarServiceImpl
	 * 3. Commnet			: 특정 회원의 특정 날짜에 등록된 식단 일지를 조회하는 메소드
	 * 4. 작성자				: songminjung
	 * 5. 작성일				: 2024. 9. 30. 오후 2:49:56
	 * </PRE>
	 * 		@param dto
	 * 		@return List<DietJournalDto>
	 */
	@Override
	public List<DietJournalDto> getDietJournal(DietJournalDto dto) {
		
		return calDao.getDietJournal(dto);
	}

	/**
	 * <PRE>
	 * 1. MethodName	: disconnect
	 * 2. ClassName		: TrainerCalendarServiceImpl
	 * 3. Commnet			: 특정 회원의 특정 날짜에 등록된 운동 일지를 조회하는 메소드
	 * 4. 작성자				: songminjung
	 * 5. 작성일				: 2024. 9. 30. 오후 2:49:56
	 * </PRE>
	 * 		@param dto
	 * 		@return <ExerciseJournalDto>
	 */
	@Override
	public List<ExerciseJournalDto> getExerJournal(ExerciseJournalDto dto) {
		return calDao.getExerJournal(dto);
	}


}
