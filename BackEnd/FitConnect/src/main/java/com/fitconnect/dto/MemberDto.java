package com.fitconnect.dto;

import java.sql.Date;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Alias("memberDto")
public class MemberDto {
	private int user_num;
	private int member_num;
	private int trainer_num;
	private int member_weight;
	private int member_height;
	private String member_gender;
	private String plan;
	private String weeklyPlan;
	private String name;
}
