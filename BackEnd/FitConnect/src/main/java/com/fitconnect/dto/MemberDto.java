package com.fitconnect.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/*
CREATE TABLE MEMBER_INFO (
	member_num NUMBER PRIMARY KEY,
	trainer_num NUMBER,
	member_height NUMBER(5,2),
	member_weight NUMBER(5,2),
	member_gender VARCHAR2(100),
	plan VARCHAR2(500),
	weeklyplan VARCHAR2(500)
);
*/

@Alias("MemberDto")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MemberDto {
	private int member_num;
	private int trainer_num;
	private int member_height;
	private int member_weight;
	private String member_gender;
	private String plan;
	private String weeklyplan;
}
