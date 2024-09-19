package com.fitconnect.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/*
CREATE TABLE TRAINER_INFO (
	trainer_num NUMBER PRIMARY KEY,
	trainer_insta VARCHAR2(500),
	trainer_intro VARCHAR2(500),
	gym_name VARCHAR2(100),
	gym_link VARCHAR2(500)
); 
 */

@Alias("TrainerDto")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrainerDto {
	private int trainer_num;
	private String trainer_insta;
	private String trainer_intro;
	private String gym_name;
	private String gym_link;
}