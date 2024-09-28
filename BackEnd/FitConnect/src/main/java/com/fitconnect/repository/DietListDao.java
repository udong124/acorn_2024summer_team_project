package com.fitconnect.repository;

import java.util.List;

import com.fitconnect.dto.DietListDto;


public interface DietListDao {
	public List<DietListDto> getList(DietListDto dto);
	public void insert(DietListDto dto);
	public void managerInsert(DietListDto dto);
}
