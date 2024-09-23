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
	@Override
	public List<ExerciseJournalDto> selectJournalAll(int m_calendar_id) {
		return journalDao.getExerJournalList(m_calendar_id);
	}

	// 특정 날짜 내 등록된 운동 일지 내 특정 1개의 운동 기록 조회
	@Override
	public ExerciseJournalDto selectExerJournalOne(int e_journal_id) {
		return journalDao.getExer(e_journal_id);
	}

	
	// 특정 날짜에 운동 일지 등록
	@Override
	public boolean addExercise(List<ExerciseJournalDto> exerJournalList) {
		boolean isSuccess=false;
		for(ExerciseJournalDto dto:exerJournalList) {
			isSuccess = journalDao.insert(dto);
		}
		return isSuccess;
	}
	
	// 특청 운동 1가지 삭제
	@Override
	public boolean deleteExer(ExerciseJournalDto dto) {
		boolean isSuccess = journalDao.delete(dto);
		return isSuccess;
	}
	
	// 특정 날짜 내 운동 기록 전체 삭제
	@Override
	public boolean deleteExerAll(int m_calendar_id) {
		boolean isSuccess = journalDao.deleteAll(m_calendar_id);
		return isSuccess;
	}

	// 운동 기록 수정
	@Override
	public boolean update(ExerciseJournalDto dto) {
		
		boolean isSuccess = journalDao.update(dto);
		System.out.println("serviceImpl"+dto);
		return isSuccess;
	}

	// 전체 운동리스트 조회
	@Override
	public List<ExerciseListDto> selectExetAll() {
		return listDao.getExerList();
	}

	// 카테고리 별 운동 리스트 조회
	@Override
	public List<ExerciseListDto> seleteCategory(String exercise_category) {
		return listDao.getcategory(exercise_category);
		
	}

	// 특정 한가지의 운동 상세 정보 조회
	@Override
	public ExerciseListDto exerDetail(int exercise_id) {
		
		return listDao.getDetail(exercise_id);
	}


	// 운동 리스트 내 운동 등록 (관리자용)
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
