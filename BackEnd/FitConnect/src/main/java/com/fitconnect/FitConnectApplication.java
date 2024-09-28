package com.fitconnect;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.PropertySource;

//resources/custom.properties 파일 로딩
@PropertySource(value="classpath:custom.properties")
@SpringBootApplication
public class FitConnectApplication {

	/**
	 * 
	 */
	/**********************************************************************
	 * <PRE> * 메소드 정보 *
	 * 1. MethodName	: main
	 * 2. ClassName		: FitConnectApplication
	 * 3. 작성자			: uJuu
	 * 4. 작성일			: 2024. 9. 28. 오후 4:17:19
	 * 5. 설명			: 이클래스가 존재하는 페키지(com.example.boot01) 또는 하위 페키지를 모두 scan 해서 
	 *  				  spring 이 관리할 객체를 생성하도록 한다 (@SpringBootApplication 어노테이션의 기능)
	 * </PRE>
	 * 		@return void
	 * 		@param args
	**********************************************************************/
	public static void main(String[] args) {
		SpringApplication.run(FitConnectApplication.class, args);
	}

}
