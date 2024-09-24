package com.fitconnect.repository;

import java.util.List;

import com.fitconnect.dto.MemberDto;
import com.fitconnect.dto.TrainerDto;

public interface TrainerDao {
	public List<TrainerDto> getList();
	public List<MemberDto> getTrainerMemberList(int trainer_num);
	public TrainerDto getData(int trainer_num);
	public void insert(TrainerDto dto);
	public void updateInfo(TrainerDto dto);
	public void updateGymInfo(TrainerDto dto);
	public void delete(int trainer_num);
}
