package com.fitconnect.repository;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.fitconnect.dto.TrainerDto;

@Repository
public class TrainerDaoImpl implements TrainerDao{
	
	@Autowired private SqlSession session;

	@Override
	public List<TrainerDto> getList() {
		return session.selectList("trainer.getList");
	}

	@Override
	public TrainerDto getData(int trainer_num) {
		return session.selectOne("trainer.getData", trainer_num);
	}

	@Override
	public void insert(TrainerDto dto) {
		session.insert("trainer.insert", dto);
	}

	@Override
	public void updateInfo(TrainerDto dto) {
		session.update("trainer.updateInfo", dto);
	}

	@Override
	public void updateGymInfo(TrainerDto dto) {
		session.update("trainer.updateGymInfo", dto);
	}

	@Override
	public void delete(int trainer_num) {
		session.delete("trainer.delete", trainer_num);
	}

}