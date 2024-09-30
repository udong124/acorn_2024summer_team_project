package com.fitconnect.repository;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.fitconnect.dto.MemberDto;
import com.fitconnect.dto.TrainerDto;

@Repository
public class TrainerDaoImpl implements TrainerDao{
	
	@Autowired private SqlSession session;

	@Override
	public List<TrainerDto> getList() {
		return session.selectList("trainer.getList");
	}

	@Override
	public List<MemberDto> getTrainerMemberList(int trainer_num) {
		return session.selectList("trainer.getTrainerMemberList", trainer_num);
	}

	@Override
	public TrainerDto getData(int trainer_num) {
		return session.selectOne("trainer.getData", trainer_num);
	}

	@Override
	public boolean insert(TrainerDto dto) {
		int rowCount = session.insert("trainer.insert", dto);
		if(rowCount>0) {
			return true;
		}else{
			return false;
		}
	}

	@Override
	public boolean updateInfo(TrainerDto dto) {
		int rowCount = session.update("trainer.updateInfo", dto);
		if(rowCount>0) {
			return true;
		}else{
			return false;
		}
	}

	@Override
	public boolean updateGymInfo(TrainerDto dto) {
		int rowCount = session.update("trainer.updateGymInfo", dto);
		if(rowCount>0) {
			return true;
		}else{
			return false;
		}
	}

	@Override
	public boolean delete(int trainer_num) {
		int rowCount = session.delete("trainer.delete", trainer_num);
		if(rowCount>0) {
			return true;
		}else{
			return false;
		}
	}

}