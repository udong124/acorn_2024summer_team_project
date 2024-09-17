package com.fitconnect.service;


import java.util.List;
import java.util.Map;

import com.fitconnect.dto.ExerciseJournalDto;
import com.fitconnect.dto.ExerciseListDto;
import com.fitconnect.repository.ExerciseListDao;

public interface ExerciseService {
	//특정 날짜의 전체 운동 일지 기록 조회
	public List<ExerciseJournalDto> selectJournalAll(int m_calendar_id);
	// 특정 날짜 내 등록된 운동 일지 내 특정 1개의 운동 기록 조회
	public ExerciseJournalDto selectExerJournalOne(int e_journal_id);
	// 특정 날짜에 운동 일지 등록
	public boolean addExercise(List<ExerciseJournalDto> exerJournalList);
	// 특청 운동 1가지 삭제
	public boolean deleteExer(ExerciseJournalDto dto);
	// 특정 날짜 내 운동 기록 전체 삭제
	public boolean deleteExerAll(int m_calendar_id);
	// 운동 기록 수정
	public boolean update(ExerciseJournalDto dto);
	
	// 전체 운동리스트 조회
	public List<ExerciseListDto> selectExetAll();
	// 카테고리 별 운동 리스트 조회
	public List<ExerciseListDto> seleteCategory(String exercise_category);
	// 특정 한가지의 운동 상세 정보 조회
	public ExerciseListDto exerDetail(int exercise_id);
	// 운동 리스트 내 운동 등록 (관리자용)
	public boolean addExerList(ExerciseListDto dto);
}
