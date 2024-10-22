package com.fitconnect.repository;

import java.util.List;

import com.fitconnect.dto.MemberDto;
import com.fitconnect.dto.TrainerDto;

public interface TrainerDao {
	public List<TrainerDto> getList();
	public List<MemberDto> getTrainerMemberList(int trainer_num);
	public TrainerDto getData(int trainer_num);
	public boolean insert(TrainerDto dto);
	public boolean updateInfo(TrainerDto dto);
	public boolean updateGymInfo(TrainerDto dto);
	public boolean delete(int trainer_num);
}
