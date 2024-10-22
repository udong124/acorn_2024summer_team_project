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
		// 사용자가 검색한 키워드에 해당하는 음식만 조회할 수 있도록 dto 에 getKeyword 를 담아준다.
		dto.setKeyword(dto.getKeyword());
		return dao.getList(dto);
	}

	@Override
	public boolean insert(DietListDto dto) {
		
		boolean isSuccess = dao.insert(dto);
		return isSuccess;
	}

	@Override
	public boolean managerInsert(DietListDto dto) {
		
		boolean isSuccess =dao.managerInsert(dto);
		return isSuccess;
	}

}
