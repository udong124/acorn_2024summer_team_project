package com.fitconnect.member.memberset;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder  // .action().action2()... 형태로 객체를 만들수 있게 해준다. 
@AllArgsConstructor//모든 인자를 전달받는 생성자
@NoArgsConstructor //default 생성자
@Data  // setter, getter 메소드 등을 만들어준다.

public class MemberDto {
	private int memberNum;
	private int trainerNum;
	private Double memberHeight;
	private Double memberWeight;
	private String memberGender;
	private String plan;
	private String weeklyPlan;
	
}
