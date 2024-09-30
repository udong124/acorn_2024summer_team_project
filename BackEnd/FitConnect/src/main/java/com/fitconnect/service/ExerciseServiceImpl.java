package com.fitconnect.service;

import java.io.File;
import java.sql.Date;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.fitconnect.dto.ExerciseJournalDto;
import com.fitconnect.dto.ExerciseListDto;
import com.fitconnect.repository.ExerciseJournalDao;
import com.fitconnect.repository.ExerciseListDao;

@Service
public class ExerciseServiceImpl implements ExerciseService {

	@Autowired private ExerciseListDao listDao;
	@Autowired private ExerciseJournalDao journalDao;
	
	@Value("${file.location}")
	private String fileLocation;

	//특정 날짜의 전체 운동 일지 기록 조회
	/**
	 * <PRE>
	 * 1. MethodName	: selectJournalAll
	 * 2. ClassName		: ExerciseServiceImpl
	 * 3. Commnet			: 특정 날짜의 전체 운동 일지를 조회하는 메소드
	 * 4. 작성자				: songminjung
	 * 5. 작성일				: 2024. 9. 30. 오후 2:28:04
	 * </PRE>
	 * 		@param m_calendar_id
	 * 		@return List<ExerciseJournalDto>
	 */
	@Override
	public List<ExerciseJournalDto> selectJournalAll(int m_calendar_id) {
		List<ExerciseJournalDto> list = journalDao.getExerJournalList(m_calendar_id);
		
		return list;
	}

	
	// 특정 날짜 내 등록된 운동 일지 내 특정 1개의 운동 기록 조회
	/**
	 * <PRE>
	 * 1. MethodName	: selectExerJournalOne
	 * 2. ClassName		: ExerciseServiceImpl
	 * 3. Commnet			: 특정 날짜에 등록된 특정 운동 일지 1개의 운동 기록을 조회하는 메소드
	 * 4. 작성자				: songminjung
	 * 5. 작성일				: 2024. 9. 30. 오후 2:38:59
	 * </PRE>
	 * 		@param e_journal_id
	 * 		@return ExerciseJournalDto
	 */
	@Override
	public ExerciseJournalDto selectExerJournalOne(int e_journal_id) {
		return journalDao.getExer(e_journal_id);
	}

	
	// 특정 날짜에 운동 일지 등록
	/**
	 * <PRE>
	 * 1. MethodName	: addExercise
	 * 2. ClassName		: ExerciseServiceImpl
	 * 3. Commnet			: 특정 날짜에 운동 일지를 등록하는 메소드
	 * 4. 작성자				: songminjung
	 * 5. 작성일				: 2024. 9. 30. 오후 2:37:58
	 * </PRE>
	 * 		@param exerJournalList
	 * 		@return true or false
	 */
	@Override
	public boolean addExercise(List<ExerciseJournalDto> exerJournalList) {
		boolean isSuccess=false;
		for(ExerciseJournalDto dto:exerJournalList) {
			isSuccess = journalDao.insert(dto);
		}
		return isSuccess;
	}
	
	// 특청 운동 1가지 삭제
	/**
	 * <PRE>
	 * 1. MethodName	: deleteExer
	 * 2. ClassName		: ExerciseServiceImpl
	 * 3. Commnet			: 특정 날짜에 등록된 특정 운동 일지 1개를 삭제하는 메소드
	 * 4. 작성자				: songminjung
	 * 5. 작성일				: 2024. 9. 30. 오후 2:38:00
	 * </PRE>
	 * 		@param dto
	 * 		@return true or false
	 */
	@Override
	public boolean deleteExer(ExerciseJournalDto dto) {
		boolean isSuccess = journalDao.delete(dto);
		return isSuccess;
	}
	
	// 특정 날짜 내 운동 기록 전체 삭제
	/**
	 * <PRE>
	 * 1. MethodName	: deleteExerAll
	 * 2. ClassName		: ExerciseServiceImpl
	 * 3. Commnet			: 특정 날짜의 운동을 모두 삭제하는 메소드
	 * 4. 작성자				: songminjung
	 * 5. 작성일				: 2024. 9. 30. 오후 2:38:03
	 * </PRE>
	 * 		@param m_calendar_id
	 * 		@return true or false
	 */
	@Override
	public boolean deleteExerAll(int m_calendar_id) {
		boolean isSuccess = journalDao.deleteAll(m_calendar_id);
		return isSuccess;
	}

	// 운동 기록 수정
	/**
	 * <PRE>
	 * 1. MethodName	: update
	 * 2. ClassName		: ExerciseServiceImpl
	 * 3. Commnet			: 특정 날짜에 등록된 운동 일지를 수정하는 메소드
	 * 4. 작성자				: songminjung
	 * 5. 작성일				: 2024. 9. 30. 오후 2:38:19
	 * </PRE>
	 * 		@param dto
	 * 		@return true or false
	 */
	@Override
	public boolean update(ExerciseJournalDto dto) {
		
		boolean isSuccess = journalDao.update(dto);
		System.out.println("serviceImpl"+dto);
		return isSuccess;
	}

	// 전체 운동리스트 조회
	/**
	 * <PRE>
	 * 1. MethodName	: selectExetAll
	 * 2. ClassName		: ExerciseServiceImpl
	 * 3. Commnet			: 전체 운동 리스트를 조회하는 메소드
	 * 4. 작성자				: songminjung
	 * 5. 작성일				: 2024. 9. 30. 오후 2:38:23
	 * </PRE>
	 * 		@return
	 */
	@Override
	public List<ExerciseListDto> selectExetAll() {
		return listDao.getExerList();
	}

	// 카테고리 별 운동 리스트 조회
	/**
	 * <PRE>
	 * 1. MethodName	: seleteCategory
	 * 2. ClassName		: ExerciseServiceImpl
	 * 3. Commnet			: 특정 카테고리 별로 운동 리스트를 조회할 수 있는 메소드
	 * 4. 작성자				: songminjung
	 * 5. 작성일				: 2024. 9. 30. 오후 2:38:26
	 * </PRE>
	 * 		@param exercise_category
	 * 		@return
	 */
	@Override
	public List<ExerciseListDto> seleteCategory(String exercise_category) {
		return listDao.getcategory(exercise_category);
		
	}

	// 특정 한가지의 운동 상세 정보 조회
	/**
	 * <PRE>
	 * 1. MethodName	: exerDetail
	 * 2. ClassName		: ExerciseServiceImpl
	 * 3. Commnet			: 운동 리스트 내의 특정 1개 운동의 상세 정보를 조회하는 메소드
	 * 4. 작성자				: songminjung
	 * 5. 작성일				: 2024. 9. 30. 오후 2:38:28
	 * </PRE>
	 * 		@param exercise_id
	 * 		@return
	 */
	@Override
	public ExerciseListDto exerDetail(int exercise_id) {
		
		return listDao.getDetail(exercise_id);
	}


	// 운동 리스트 내 운동 등록 (관리자용)
	/**
	 * <PRE>
	 * 1. MethodName	: addExerList
	 * 2. ClassName		: ExerciseServiceImpl
	 * 3. Commnet			: 관리자 권한으로 운동 리스트의 운동을 등록하는 메소드
	 * 4. 작성자				: songminjung
	 * 5. 작성일				: 2024. 9. 30. 오후 2:38:36
	 * </PRE>
	 * 		@param dto
	 * 		@return true or false
	 */
	@Override
	public boolean addExerList(ExerciseListDto dto) {
		
		MultipartFile image = dto.getImage();
		
		String exercise_image=UUID.randomUUID().toString();
		//저장할 파일의 전체 경로 구성하기 
		String filePath=fileLocation+File.separator+exercise_image;
		try {
			//업로드된 파일을 이동시킬 목적지 File 객체
			File f=new File(filePath);
			image.transferTo(f);
		}catch(Exception e) {
			e.printStackTrace();
		}
		dto.setExercise_image(exercise_image);
		boolean isSuccess = listDao.insertExetList(dto);
		return isSuccess;
	}
}
