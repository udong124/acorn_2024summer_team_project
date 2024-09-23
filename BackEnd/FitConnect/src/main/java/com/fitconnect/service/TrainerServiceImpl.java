package com.fitconnect.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fitconnect.dto.TrainerDto;
import com.fitconnect.dto.UserDto;
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

	@Override
	public Map<String, Object> selectOneUserInfo(String userName) {
		int trainer_num = userDao.getData(userName).getId();
		UserDto userDto = userDao.getData(userName);
		TrainerDto trainerDto = trainerDao.getData(trainer_num);
		
		Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("id", userDto.getId());
        resultMap.put("name", userDto.getName());
        resultMap.put("email", userDto.getEmail());
        resultMap.put("profile", userDto.getProfile());
        resultMap.put("regdate", userDto.getRegdate());
        resultMap.put("trainer_insta", trainerDto.getTrainer_insta());
        resultMap.put("trainer_intro", trainerDto.getTrainer_intro());
        resultMap.put("gym_name", trainerDto.getGym_name());
        resultMap.put("gym_link", trainerDto.getGym_link());
		return resultMap;
	}

}