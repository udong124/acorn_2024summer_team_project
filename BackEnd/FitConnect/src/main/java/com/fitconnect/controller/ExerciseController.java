package com.fitconnect.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.fitconnect.dto.ExerciseJournalDto;
import com.fitconnect.dto.ExerciseListDto;
import com.fitconnect.service.ExerciseService;

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
	
	
	/**********************************************************************
	 * <PRE> * 메소드 정보 *
	 * 1. MethodName	: getExerciseList
	 * 2. ClassName		: ExerciseController
	 * 3. 작성자			: songminjung
	 * 4. 작성일			: 2024. 9. 29. 오전 10:46:28
	 * 5. 설명			: 모든 운동 리스트를 가져오는 메소드
     * 					  서비스에서 전체 운동 리스트를 가져와서 맵 형태로 반환한다.
	 * </PRE>
	 * 		@return Map<String,Object>
	 * 		@return "exerList"
	**********************************************************************/
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

	
	/**********************************************************************
	 * <PRE> * 메소드 정보 *
	 * 1. MethodName	: getCategory
	 * 2. ClassName		: ExerciseController
	 * 3. 작성자			: songminjung
	 * 4. 작성일			: 2024. 9. 29. 오전 10:47:34
	 * 5. 설명			: 특정 운동 카테고리에 해당하는 리스트를 가져오는 메소드
     *                    경로변수로 받은 운동 카테고리를 이용하여 리스트를 조회한다.
	 * </PRE>
	 * 		@return Map<String,Object>
	 * 		@param exercise_category
	 * 		@return "categoryList"
	**********************************************************************/
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
	

	/**********************************************************************
	 * <PRE> * 메소드 정보 *
	 * 1. MethodName	: exerciseDatil
	 * 2. ClassName		: ExerciseController
	 * 3. 작성자			: songminjung
	 * 4. 작성일			: 2024. 9. 29. 오전 10:48:35
	 * 5. 설명			: 특정 운동의 상세 정보를 조회하는 메소드
     *                    경로변수로 받은 운동 아이디를 이용하여 상세 정보를 가져온다.
	 * </PRE>
	 * 		@return ExerciseListDto
	 * 		@param exercise_id
	 * 		@return 
	**********************************************************************/
	@ApiResponses({
        @ApiResponse(responseCode = "200", description = "성공"),
        @ApiResponse(responseCode = "400", description = "실패")
	})
	@Operation(summary = "운동 리스트 내 특정 운동의 상세 정보", description = "파라미터로 받은 운동 아이디를 이용한 특정 운동의 상세 정보 가져오기")
	@GetMapping("/exerciselist/detail/{exercise_id}")
	public ExerciseListDto exerciseDatil(@PathVariable("exercise_id") int exercise_id) {
		return service.exerDetail(exercise_id);
	}
	
	
	/**********************************************************************
	 * <PRE> * 메소드 정보 *
	 * 1. MethodName	: addExerList
	 * 2. ClassName		: ExerciseController
	 * 3. 작성자			: songminjung
	 * 4. 작성일			: 2024. 9. 30. 오전 11:47:14
	 * 5. 설명			: 관리자 권한으로 운동 리스트 추가하는 메소드
	 * 					  exercise_name, exercise_category, exercise_info, exercise_image 의 값을 fome-data 로 받아와 운동 리스트를 추가한다.
	 * </PRE>
	 * 		@return Map<String,Object>
	 * 		@param dto
	 * 		@return "isSuccess", true or false
	**********************************************************************/
	@ApiResponses({
        @ApiResponse(responseCode = "200", description = "성공"),
        @ApiResponse(responseCode = "400", description = "실패")
	})
	@Operation(summary = "운동 리스트 등록(관리자용)", description = "관리자 권한으로 운동 리스트 목록 추가하기")
	@PostMapping(value="/exerciselist", consumes = {MediaType. APPLICATION_JSON_VALUE, MediaType. MULTIPART_FORM_DATA_VALUE})
	public Map<String, Object> addExerList(@ModelAttribute ExerciseListDto dto){
		
		boolean isSuccess = service.addExerList(dto);
		
		return Map.of("isSuccess",isSuccess);
	}
	
	
	/**********************************************************************
	 * <PRE> * 메소드 정보 *
	 * 1. MethodName	: getExerJurnalMember
	 * 2. ClassName		: ExerciseController
	 * 3. 작성자			: songminjung
	 * 4. 작성일			: 2024. 9. 30. 오전 11:51:51
	 * 5. 설명			: 특정 회원의 특정 날짜 운동 리스트를 가져오는 매소드
	 * 					  경로변수로 받아온 m_calendar_id 를 이용하여 특정 날짜의 운동 일지를 조회한다.
	 * </PRE>
	 * 		@return Map<String,Object>
	 * 		@param m_calendar_id
	 * 		@return "exerJournalList"
	**********************************************************************/
	@ApiResponses({
        @ApiResponse(responseCode = "200", description = "성공"),
        @ApiResponse(responseCode = "400", description = "실패")
	})
	@Operation(summary = "운동 일지 조회", description = "특정 회원의 특정 날짜 운동 리스트 가져오기")
	@GetMapping("/exercisejournal/{m_calendar_id}")
	public Map<String, Object> getExerJurnalMember(@PathVariable("m_calendar_id")int m_calendar_id){
		Map<String, Object> map=new HashMap<>();
		map.put("exerJournalList", service.selectJournalAll(m_calendar_id));
		
		return map;
	}
	
	/**********************************************************************
	 * <PRE> * 메소드 정보 *
	 * 1. MethodName	: getJournalOne
	 * 2. ClassName		: ExerciseController
	 * 3. 작성자			: songminjung
	 * 4. 작성일			: 2024. 9. 30. 오전 11:51:56
	 * 5. 설명			: 운동 일지에 등록된 운동 중 특정 1개의 운동 정보를 조회 메소드
	 * 					  경로변수로 받아온 e_journal_id 를 이용해서 운동 일지 내 특정 운동 1개의 정보를 조회한다.
	 * </PRE>
	 * 		@return Map<String,Object>
	 * 		@param e_journal_id
	 * 		@return "exerJournalDto"
	**********************************************************************/
	@ApiResponses({
        @ApiResponse(responseCode = "200", description = "성공"),
        @ApiResponse(responseCode = "400", description = "실패")
	})
	@Operation(summary = "운동일지 내 특정 운동 정보", description = "운동 일지에 등록한 운동 중 특정 운동 정보 가져오기")
	@GetMapping("/exercisejournal/detail/{e_journal_id}")
	public Map<String, Object> getJournalOne(@PathVariable("e_journal_id") int e_journal_id){
		
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("exerJournalDto", service.selectExerJournalOne(e_journal_id));
		return map;
	}
	
	/**********************************************************************
	 * <PRE> * 메소드 정보 *
	 * 1. MethodName	: addExerJournal
	 * 2. ClassName		: ExerciseController
	 * 3. 작성자			: songminjung
	 * 4. 작성일			: 2024. 9. 30. 오전 11:52:02
	 * 5. 설명			: 특정 날짜에 운동 일지 등록하는 메소드
	 * 					  m_calendar_id, exercise_id, exercise_order, exercise_set, exercise_count, exercise_weight 의 값을 json 형태로 받아와 등록한다.
	 *  
	 * </PRE>
	 * 		@return Map<String,Object>
	 * 		@param exerJournalList
	 * 		@return "isSuccess", true or false
	**********************************************************************/
	@ApiResponses({
        @ApiResponse(responseCode = "200", description = "성공"),
        @ApiResponse(responseCode = "400", description = "실패")
	})
	@Operation(summary = "운동 일지 등록", description = "특정 날짜에 운동일지 등록하기")
	@PostMapping("/exercisejournal")
	public Map<String, Object> addExerJournal(@RequestBody List<ExerciseJournalDto> exerJournalList){
		
		boolean isSuccess = service.addExercise(exerJournalList);
		
		return Map.of("isSuccess", isSuccess);
	}
	
	
	
	/**********************************************************************
	 * <PRE> * 메소드 정보 *
	 * 1. MethodName	: updateExer
	 * 2. ClassName		: ExerciseController
	 * 3. 작성자			: songminjung
	 * 4. 작성일			: 2024. 9. 30. 오후 12:44:27
	 * 5. 설명			: 운동 일지 내용을 수정하는 메소드
	 * 					  운동 일지 내 e_journal_id 와 일치하는 운동 일지를 json 형태로 받아온 ExerciseJournalDto 값으로 수정한다.
	 * </PRE>
	 * 		@return Map<String,Object>
	 * 		@param e_journal_id
	 * 		@param dto
	 * 		@return "isSuccess", true or false
	**********************************************************************/
	@ApiResponses({
        @ApiResponse(responseCode = "200", description = "성공"),
        @ApiResponse(responseCode = "400", description = "실패")
	})
	@Operation(summary = "운동 일지 수정", description = "운동 일지 내 등록된 운동 중 특정 운동의 아이디 값을 이용하여 특정 운동 내용 수정하기")
	@PutMapping("/exercisejournal/{e_journal_id}")
	public Map<String, Object> updateExer(@PathVariable("e_journal_id") int e_journal_id, @RequestBody ExerciseJournalDto dto){
		dto.setE_journal_id(e_journal_id);
		boolean isSuccess = service.update(dto);
		
		return Map.of("isSuccess",isSuccess);
	}
	
	/**********************************************************************
	 * <PRE> * 메소드 정보 *
	 * 1. MethodName	: deleteExer
	 * 2. ClassName		: ExerciseController
	 * 3. 작성자			: songminjung
	 * 4. 작성일			: 2024. 9. 30. 오후 12:44:32
	 * 5. 설명			: 운동 일지 내 등록된 특정 운동 1개 삭제하기
	 * 					  경로변수로 받아온 e_journal_id, exercise_id 두가지 값을 이용하여 특정 일지 내 특정 운동 1개를 삭제한다.
	 * </PRE>
	 * 		@return Map<String,Object>
	 * 		@param e_journal_id
	 * 		@param exercise_id
	 * 		@return "isSuccess", true or false
	**********************************************************************/
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
	
	/**********************************************************************
	 * <PRE> * 메소드 정보 *
	 * 1. MethodName	: deleteExerAll
	 * 2. ClassName		: ExerciseController
	 * 3. 작성자			: songminjung
	 * 4. 작성일			: 2024. 9. 30. 오후 12:44:38
	 * 5. 설명			: 특정 날짜의 운동 일지를 전체 삭제하는 메소드
	 * 					  경로변수로 받아온 m_calendar_id 를 이용해서 특정 날짜의 전체 운동 일지를 삭제한다.
	 * </PRE>
	 * 		@return Map<String,Object>
	 * 		@param m_calendar_id
	 * 		@return "isSuccess", true or false
	**********************************************************************/
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
	
	
	
	
	
	
	
	
	
	
	
	
	
}
