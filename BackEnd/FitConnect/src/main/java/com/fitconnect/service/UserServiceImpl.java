package com.fitconnect.service;

import java.io.File;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.fitconnect.dto.UserDto;
import com.fitconnect.repository.UserDao;

import io.swagger.v3.oas.annotations.servers.Server;

@Service
public class UserServiceImpl implements UserService {
	@Value("${file.location}")
	private String fileLocation;
	
	@Autowired private UserDao dao;

	@Override
	public void updateInfo(UserDto dto) {
		MultipartFile image=dto.getImage();
		//만일 선택한 프로필 이미지가 있다면 
		if(image.getSize() != 0) {
			//파일을 원하는 위치로 이동시켜 놓고 
			String saveFileName=UUID.randomUUID().toString();
			//저장할 파일의 전체 경로 구성하기
			String filePath=fileLocation+File.separator+saveFileName;
			try {
				//업로드된 파일을 이동시킬 목적지 File 객체
				File f=new File(filePath);
				//MultipartFile 객체의 메소드를 통해서 실제로 이동시키기(전송하기)
				dto.getImage().transferTo(f);
			}catch(Exception e) {
				e.printStackTrace();
			}
			//UserDto 에 저장된 이미지의 이름을 넣어준다.
			dto.setProfile(saveFileName);
		}
		
        dto.setId(dto.getId());
		
		dao.updateInfo(dto);
	}
}
