package com.fitconnect.trainer.repository;

import java.util.List;

import com.fitconnect.trainer.dto.ExerciseListDto;

public interface ExerciseListDao {
	public List<ExerciseListDto> getExerList();
	public ExerciseListDto getDetail(int exercise_id);
	public List<ExerciseListDto> getcategory(String exercise_category);
	public boolean insertExetList(ExerciseListDto dto);
}
