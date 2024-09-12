package com.fitconnect.trainer.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.fitconnect.trainer.dto.ExerciseJournalDto;
import com.fitconnect.trainer.dto.ExerciseListDto;
import com.fitconnect.trainer.repository.ExerciseListDao;
import com.fitconnect.trainer.service.ExerciseService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;

@Tag(name = "Exercise API", description = "컨트롤러에 대한 설명입니다.")
@RestController
public class ExerciseController {

	@Autowired private ExerciseService service;
	
	@ApiResponses({
        @ApiResponse(responseCode = "200", description = "성공"),
        @ApiResponse(responseCode = "400", description = "실패")
	})
	@Operation(summary = "운동 리스트", description = "운동 리스트 가져오기")
	@GetMapping("/exerciselist")
	public Map<String, Object> getExerciseList(){
		List<ExerciseListDto> list = service.selectExetAll();
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("exerList", list);
		return map;
	}
	
	@ApiResponses({
        @ApiResponse(responseCode = "200", description = "성공"),
        @ApiResponse(responseCode = "400", description = "실패")
	})
	@Operation(summary = "카테고리 별 운동 리스트", description = "카테고리 별로 운동 리스트 가져오기")
	@GetMapping("/exerciselist/{exercise_category}")
	public Map<String, Object> getCategory(@PathVariable("exercise_category") String exercise_category){
		List<ExerciseListDto> list = service.seleteCategory(exercise_category);
		return Map.of("categoryList", list);
	}
	
	@ApiResponses({
        @ApiResponse(responseCode = "200", description = "성공"),
        @ApiResponse(responseCode = "400", description = "실패")
	})
	@Operation(summary = "운동 리스트 내 특정 운동의 상세 정보", description = "파라미터로 받은 운동 아이디를 이용한 특정 운동의 상세 정보 가져오기")
	@GetMapping("/exerciselist/detail/{exercise_id}")
	public ExerciseListDto exerciseDatil(@PathVariable("exercise_id") int exercise_id) {
		return service.ExerDetail(exercise_id);
	}
	
	@ApiResponses({
        @ApiResponse(responseCode = "200", description = "성공"),
        @ApiResponse(responseCode = "400", description = "실패")
	})
	@Operation(summary = "운동 일지 조회", description = "특정 회원의 특정 날짜 운동 리스트 가져오기")
	@GetMapping("/exercisejournal/{m_calendar_id}")
	public Map<String, Object> getExerJurnalMember(@PathVariable("m_calendar_id")int m_calendar_id, ExerciseJournalDto dto){
		dto.setM_calendar_id(m_calendar_id);
		Map<String, Object> map=new HashMap<>();
		map.put("exerJournalList", service.SelectJournalAll(m_calendar_id));
		return map;
	}
	
	@ApiResponses({
        @ApiResponse(responseCode = "200", description = "성공"),
        @ApiResponse(responseCode = "400", description = "실패")
	})
	@Operation(summary = "운동일지 내 특정 운동 정보", description = "운동 일지에 등록한 운동 중 특정 운동 정보 가져오기")
	@GetMapping("/exercisejournal/detail/{e_journal_id}")
	public Map<String, Object> getJournalOne(@PathVariable("e_journal_id") int e_journal_id, ExerciseJournalDto dto){
		
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("exerJournalDto", service.selectExerJournalOne(e_journal_id));
		return map;
	}
	
	
	
	@ApiResponses({
        @ApiResponse(responseCode = "200", description = "성공"),
        @ApiResponse(responseCode = "400", description = "실패")
	})
	@Operation(summary = "운동 일지 수정", description = "운동 일지 내 등록된 운동 중 특정 운동의 아이디 값을 이용하여 특정 운동 내용 수정하기")
	@PutMapping("/exercisejournal/{e_journal_id}")
	public Map<String, Object> updateExer(@PathVariable("e_journal_id") int e_journal_id, ExerciseJournalDto dto){
		dto.setE_journal_id(e_journal_id);
		Boolean isSuccess = service.update(dto);
		
		return Map.of("isSuccess",isSuccess);
	}
	
	@ApiResponses({
        @ApiResponse(responseCode = "200", description = "성공"),
        @ApiResponse(responseCode = "400", description = "실패")
	})
	@Operation(summary = "운동 일지 삭제", description = "운동 일지 내 등록된 특정 운동 삭제하기")
	@DeleteMapping("/exercisejournal/{exercise_id}/{e_journal_id}")
	public Map<String, Object> deleteExer(@PathVariable("e_journal_id") int e_journal_id, @PathVariable("exercise_id") int exercise_id){
		ExerciseJournalDto dto = new ExerciseJournalDto();
		dto.setE_journal_id(e_journal_id);
		dto.setExercise_id(exercise_id);
		boolean isSuccess =service.deleteExer(dto);
		return Map.of("isSuccess", isSuccess);
	}
	
	@ApiResponses({
        @ApiResponse(responseCode = "200", description = "성공"),
        @ApiResponse(responseCode = "400", description = "실패")
	})
	@Operation(summary = "특정 날짜 운동 일지 삭제", description = "운동 일지 내 등록된 특정 날짜의 전체 운동 삭제하기")
	@DeleteMapping("/exercisejournal/calendar/{m_calendar_id}")
	public Map<String, Object> deleteExerAll(@PathVariable("m_calendar_id") int m_calendar_id){
		boolean isSuccess =service.deleteExerAll(m_calendar_id);
		return Map.of("isSuccess", isSuccess);
	}
	
	
	
	@ApiResponses({
        @ApiResponse(responseCode = "200", description = "성공"),
        @ApiResponse(responseCode = "400", description = "실패")
	})
	@Operation(summary = "운동 일지 등록", description = "특정 날짜에 운동일지 등록하기")
	@PostMapping("/exercisejournal/{m_calendar_id}")
	public Map<String, Object> addExerJournal(@PathVariable("m_calendar_id")int m_calendar_id,@RequestBody List<ExerciseJournalDto> exerJournalList){
		
		boolean isSuccess = service.addExercise(exerJournalList);
		
		return Map.of("isSuccess", isSuccess);
	}
	
	
	
	
	
	
	
	
	
	
	
	
}
