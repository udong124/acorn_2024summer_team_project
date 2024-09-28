package com.fitconnect.service;

import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.catalina.mapper.Mapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.fitconnect.auth.PrincipalDetails;
import com.fitconnect.dto.DietJournalDto;
import com.fitconnect.repository.DietJournalDao;

@Service
public class DietJournalServiceImpl implements DietJournalService{

	@Autowired DietJournalDao dao;
	/**
	 * 로그인된 사용자 토큰으로 id 값을 받아와 특정 사용자를 지칭하고 dto 에 담아준다.
	 */
	@Override
	public List<DietJournalDto> getList(DietJournalDto dto) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		int user_num = ((PrincipalDetails) authentication.getPrincipal()).getDto().getId();
		
		dto.setMember_num(user_num);
		return dao.getList(dto);
	}

	@Override
	/**
	 * 식단일지에서는 음식을 여러개 선택하고 한 번에 insert 요청을 보내기 때문에 반복문을 사용해 dao를 여러번 호출한다.
	 */
	public boolean insert(List<DietJournalDto> dietjournalList) {
		boolean isSuccess = false;
		for (DietJournalDto dto : dietjournalList) {
			isSuccess = dao.insert(dto);
		}
		return isSuccess;
	}

	@Override
	public boolean update(DietJournalDto dto) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		int user_num = ((PrincipalDetails) authentication.getPrincipal()).getDto().getId();
		dto.setMember_num(user_num);
		
		boolean isSuccess = dao.update(dto);
		
		return isSuccess;
	}

	@Override
	public boolean delete(int d_journal_id) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		int user_num = ((PrincipalDetails) authentication.getPrincipal()).getDto().getId();

		boolean isSuccess = dao.delete(user_num, d_journal_id);
		
		return isSuccess;
	}

	@Override
	public boolean deleteAll(int m_calendar_id) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		int user_num = ((PrincipalDetails) authentication.getPrincipal()).getDto().getId();
		
		boolean isSuccess = dao.deleteAll(user_num, m_calendar_id);
		return isSuccess;
	}

}
