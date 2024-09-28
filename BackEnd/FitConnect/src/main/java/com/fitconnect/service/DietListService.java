package com.fitconnect.service;

import java.util.List;
import java.util.Map;

import com.fitconnect.dto.DietListDto;

public interface DietListService {
	public List<DietListDto> getList(DietListDto dto);
	public boolean insert(DietListDto dto);
	public boolean ManagerInsert(DietListDto dto);
}
