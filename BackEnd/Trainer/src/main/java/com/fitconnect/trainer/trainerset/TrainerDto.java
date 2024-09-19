package com.fitconnect.trainer.trainerset;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data

public class TrainerDto {
	private int trainerNum;
	private String trainerInsta;
	private String trainerIntro;
	private String gymLink;
	private String gymName;

}