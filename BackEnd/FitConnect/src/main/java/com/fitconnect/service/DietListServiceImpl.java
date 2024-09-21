package com.fitconnect.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fitconnect.dto.DietListDto;
import com.fitconnect.repository.DietListDao;


@Service
public class DietListServiceImpl implements DietListService{

	@Autowired DietListDao dao;
	
	@Override
	public List<DietListDto> getList(DietListDto dto) {
		dto.setKeyword(dto.getKeyword());
		return dao.getList(dto);
	}

	@Override
	public void insert(DietListDto dto) {
		
		dao.insert(dto);
	}

	@Override
	public void ManagerInsert(DietListDto dto) {
		
		dao.ManagerInsert(dto);
	}

}
