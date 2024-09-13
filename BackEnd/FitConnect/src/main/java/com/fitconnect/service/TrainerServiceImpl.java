package com.fitconnect.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fitconnect.dto.TrainerDto;
import com.fitconnect.repository.TrainerDao;

@Service
public class TrainerServiceImpl implements TrainerService{
	
	@Autowired private TrainerDao dao;

	@Override
	public TrainerDto createTrainer(TrainerDto dto) {
		dao.create(dto);
		return dto;
	}

	@Override
	public void updateTrainer(TrainerDto dto) {
		dao.update(dto);
		
	}

	@Override
	public void deleteTrainer(int trainerNum) {
		dao.delete(trainerNum);
		
	}



}