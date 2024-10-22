package com.fitconnect.service;

import java.util.List;
import java.util.Map;

import com.fitconnect.dto.MemberDto;
import com.fitconnect.dto.TrainerDto;

public interface TrainerService {
	public boolean addTrainer(TrainerDto dto);
	public boolean updateTrainerInfo(TrainerDto dto);
	public boolean updateTrainerGymInfo(TrainerDto dto);
	public boolean deleteTrainer(String userName);
	public TrainerDto selectOne(String userName);
	public Map<String, Object> selectOneUserInfo(String userName);
	public List<Map<String, Object>> selectList();
	public List<Map<String, Object>> selectTrainerMemberList(int trainer_num);
}
