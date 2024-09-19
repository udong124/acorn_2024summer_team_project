package com.fitconnect.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fitconnect.dto.TrainerDto;
import com.fitconnect.repository.TrainerDao;
import com.fitconnect.repository.UserDao;

@Service
public class TrainerServiceImpl implements TrainerService{
	
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private TrainerDao trainerDao;

	@Override
	public TrainerDto addTrainer(TrainerDto dto) {
		trainerDao.insert(dto);
		return trainerDao.getData(dto.getTrainer_num());
	}

	@Override
	public void updateTrainerInfo(TrainerDto dto) {
		trainerDao.updateInfo(dto);
	}

	@Override
	public void updateTrainerGymInfo(TrainerDto dto) {
		trainerDao.updateGymInfo(dto);
	}

	@Override
	public void deleteTrainer(String userName) {
		int trainer_num = userDao.getData(userName).getId();
		trainerDao.delete(trainer_num);
	}

	@Override
	public TrainerDto selectOne(String userName) {
		int trainer_num = userDao.getData(userName).getId();
		return trainerDao.getData(trainer_num);
	}

	@Override
	public List<TrainerDto> selectList() {
		return trainerDao.getList();
	}

}
