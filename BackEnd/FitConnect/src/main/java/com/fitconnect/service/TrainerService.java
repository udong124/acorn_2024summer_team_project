package com.fitconnect.service;

import java.util.List;

import com.fitconnect.dto.TrainerDto;

public interface TrainerService {
	public TrainerDto addTrainer(TrainerDto dto);
	public void updateTrainerInfo(TrainerDto dto);
	public void updateTrainerGymInfo(TrainerDto dto);
	public void deleteTrainer(String userName);
	public TrainerDto selectOne(String userName);
	public List<TrainerDto> selectList();
}
