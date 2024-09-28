package com.fitconnect.trainer.service;

import com.fitconnect.trainer.trainerset.TrainerDto;

public interface TrainerService {
	
	public TrainerDto createTrainer(TrainerDto dto);
	public void updateTrainer(TrainerDto dto);
	public void deleteTrainer(int trainerNum);

}
