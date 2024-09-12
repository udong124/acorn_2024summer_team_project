package com.fitconnect.trainer.repository;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.fitconnect.trainer.dto.ExerciseListDto;

@Repository
public class ExerciseListDaoImpl implements ExerciseListDao {

	@Autowired private SqlSession session;
	
	@Override
	public List<ExerciseListDto> getExerList() {
		return session.selectList("ExerciseList.getAll");
	}

	@Override
	public ExerciseListDto getDetail(int exercise_id) {
		return session.selectOne("ExerciseList.getDetail", exercise_id);
	}

	@Override
	public List<ExerciseListDto> getcategory(String exercise_category) {
		return session.selectList("ExerciseList.getCategory", exercise_category);
	}

}
