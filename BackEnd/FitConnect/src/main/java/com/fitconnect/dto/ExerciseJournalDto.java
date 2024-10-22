package com.fitconnect.dto;


import org.apache.ibatis.type.Alias;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Alias("exerciseJournalDto")
public class ExerciseJournalDto {
	private int member_num;
	private int e_journal_id;
	private int m_calendar_id;
	private int exercise_order;
	private String exercise_name;
	private int exercise_id;
	private int exercise_set;
	private int exercise_count;
	private float exercise_weight;
	
}
