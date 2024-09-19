package com.fitconnect.trainer.repositroy;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.fitconnect.trainer.trainerset.TrainerDto;

@Repository
public class TrainerDaoImpl implements TrainerDao{
	
	@Autowired private SqlSession session;

	@Override
	public void create(TrainerDto dto) {
		
		session.insert("trainer.insert", dto);
		
	}

	@Override
	public TrainerDto getData(int userNum) {
		
		return session.selectOne("trainer.getData", userNum);
		
	}

	@Override
	public List<TrainerDto> getList(TrainerDto dto) {
		
		return session.selectList("trainer.getList", dto);
	}

	@Override
	public void update(TrainerDto dto) {

		session.update("trainer.update", dto);
		
	}

	@Override
	public void delete(int trainerNum) {
		
		session.delete("trainer.delete", trainerNum);
		
	}
	
	//user의 id를 검색해서 trainernum을 응답 받은 다음 
	// 일반 회원과 트레이너사이의 정보를 연동하는 기능을 구현해야 함

	public int getTrinerNum(String userId) {

	    return session.selectOne("trainer.selectTrinerNum", userId);
	}

	//트레이너 아이디 조회 

	@Override
	public TrainerDto getInfo(int trainerNum) {
	
	    return session.selectOne("trainer.selectTrainerInfo", trainerNum);
	}

	//트레이너 상세 정보를 조회하고 가져옴 

}