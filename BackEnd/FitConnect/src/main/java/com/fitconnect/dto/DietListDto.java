package com.fitconnect.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Alias("DietListDto")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class DietListDto {
	private int diet_id;	// PK
	private String food; // 음식 이름
	private float calories; // 칼로리
	private float carbs; // 탄수화물(g)
	private float protein; // 단백질(g)
	private float fat; //지방(g)
	
	//검색 기능 관련 필드
	private String keyword = "";
	
}
