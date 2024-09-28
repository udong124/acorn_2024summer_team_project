package com.fitconnect.dto;

import org.apache.ibatis.type.Alias;

import jakarta.annotation.Nonnull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Alias("MemberCalendarDto")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class MemberCalendarDto {
	private int m_calendar_id;
	private int member_num;
	private String regdate;
	private String memo;
	
}
