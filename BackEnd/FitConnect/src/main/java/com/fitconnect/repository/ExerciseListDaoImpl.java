package com.fitconnect.repository;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.fitconnect.dto.ExerciseListDto;

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

	@Override
	public boolean insertExetList(ExerciseListDto dto) {
		int rowCount=session.insert("ExerciseList.insertList", dto);
		if(rowCount>0) {
			return true;
		}else {
			return false;
		}
		
	}

}
