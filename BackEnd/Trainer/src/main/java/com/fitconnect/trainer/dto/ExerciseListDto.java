package com.fitconnect.trainer.dto;

import java.sql.Date;
import java.time.LocalDateTime;

import org.apache.ibatis.type.Alias;
import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Alias("exerciseListDto")
public class ExerciseListDto {

	
	private int exercise_id;
	private String exercise_name;
	private String exercise_category;
	private String exercise_info;
	private String exercise_image;
	private MultipartFile image;
}
