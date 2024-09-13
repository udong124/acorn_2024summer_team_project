package com.fitconnect.repository;

import java.util.List;

import com.fitconnect.dto.TrainerDto;



public interface TrainerDao {
	
	public void create(TrainerDto dto);
	public TrainerDto getData(int userNum);
	public List<TrainerDto> getList(TrainerDto dto);
	public void update(TrainerDto dto);
	public void delete(int trainerNum);
	public int getTrinerNum(String userId);
	public TrainerDto getInfo(int trinerNum);


}

