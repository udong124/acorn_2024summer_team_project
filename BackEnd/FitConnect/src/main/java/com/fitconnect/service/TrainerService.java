package com.fitconnect.service;

import java.util.List;
import java.util.Map;

import com.fitconnect.dto.MemberDto;
import com.fitconnect.dto.TrainerDto;

public interface TrainerService {
	public TrainerDto addTrainer(TrainerDto dto);
	public void updateTrainerInfo(TrainerDto dto);
	public void updateTrainerGymInfo(TrainerDto dto);
	public void deleteTrainer(String userName);
	public TrainerDto selectOne(String userName);
	public Map<String, Object> selectOneUserInfo(String userName);
	public List<TrainerDto> selectList();
	public List<Map<String, Object>> selectTrainerMemberList(int trainer_num);
}
