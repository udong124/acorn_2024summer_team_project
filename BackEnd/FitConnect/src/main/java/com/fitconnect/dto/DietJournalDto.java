package com.fitconnect.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Alias("DietJournalDto")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class DietJournalDto {
	private int member_num; // 회원 PK
	
	private int d_journal_id; // 식단일지 PK
	private int m_calendar_id; // 회원 캘린더 외래키
	private int diet_id;		// 식단리스트 외래키
	private String diet_type;	// 아침, 점심, 저녁 구분하기 위한 식단타입
	private int foodCount; // 선택한 음식 개수 ex) 계란 3개, 닭가슴살 100g 2개
	
	//DietList 에서 조인한 값을 담을 dto
	private String food;
	private float calories;
	private float carbs;
	private float protein;
	private float fat;
	
}
