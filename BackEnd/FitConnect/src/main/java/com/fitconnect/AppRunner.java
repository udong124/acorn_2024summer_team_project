package com.fitconnect;

import java.util.Arrays;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

/*
 * 	Spring Boot 애플리케이션이 실행될 때 run 메소드가 호출되어
 * 	설정된 프로파일과 데이터 소스 정보를 확인할 수 있다
 */

@Component
public class AppRunner implements ApplicationRunner{

	private final Environment environment;
	
	public AppRunner(Environment environment) {
		this.environment = environment;
	}
	
	@Override
    public void run(ApplicationArguments args) {
        System.out.println("===================다중 프로파일 테스트===================");
        System.out.println("Active profiles : " + Arrays.toString(environment.getActiveProfiles()));
        System.out.println("Datasource driver : " + environment.getProperty("spring.datasource.driver-class-name"));
        System.out.println("Datasource url : " + environment.getProperty("spring.datasource.url"));
        System.out.println("Datasource username : " + environment.getProperty("spring.datasource.username"));
        System.out.println("Datasource password : " + environment.getProperty("spring.datasource.password"));
        System.out.println("Server Port : " + environment.getProperty("server.port"));
        System.out.println("Default Property : " + environment.getProperty("default.string"));
        System.out.println("Common Property : " + environment.getProperty("common.string"));
        System.out.println("====================================================");
	}
}
