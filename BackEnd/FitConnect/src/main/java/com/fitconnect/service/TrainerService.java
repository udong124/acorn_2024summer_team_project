package com.fitconnect.service;

import com.fitconnect.dto.TrainerDto;

public interface TrainerService {
	
	public TrainerDto createTrainer(TrainerDto dto);
	public void updateTrainer(TrainerDto dto);
	public void deleteTrainer(int trainerNum);

}
