package com.fitconnect.dto;

import org.apache.ibatis.type.Alias;
import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/*
CREATE TABLE USER_INFO(
	id NUMBER PRIMARY KEY,
	userName VARCHAR2(50) UNIQUE,
	password VARCHAR2(100) NOT NULL,
	name VARCHAR2(20),
	email VARCHAR2(100),
	role VARCHAR2(20) NOT NULL,
   	profile VARCHAR2(100),
   	regdate DATE,
   	provider VARCHAR2(20) NOT NULL,
   	providerid VARCHAR2(50)
);

CREATE SEQUENCE user_info_seq
START WITH 1
INCREMENT BY 1;
*/

@Alias("UserDto")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserDto {
	private int id; //PK
	private String userName;
	private String password;
	private String newPassword;
	private String name;
	private String email;
	private String role; //ADMIN | MEMBER | TRAINER
	private String profile;
	private String regdate;
	//프로필 이미지 파일 업로드 처리를 하기 위한 필드
	private MultipartFile image;
	private String provider; //google | normal
	private String providerid; //sub

}
