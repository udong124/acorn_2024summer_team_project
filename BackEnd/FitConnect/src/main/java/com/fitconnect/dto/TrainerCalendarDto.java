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
@Alias("trainerCalendarDto")
public class TrainerCalendarDto {
	private int t_calendar_id;
	private int trainer_num;
	private String name;
	private String regdate;
	private int member_num;
	private int user_id;
}
