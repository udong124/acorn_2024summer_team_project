package com.fitconnect.trainer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.PropertySource;

//resources/custom.properties 파일 로딩 
@PropertySource(value="classpath:custom.properties")
@SpringBootApplication
public class TrainerApplication {

	public static void main(String[] args) {
		SpringApplication.run(TrainerApplication.class, args);
	}

}
