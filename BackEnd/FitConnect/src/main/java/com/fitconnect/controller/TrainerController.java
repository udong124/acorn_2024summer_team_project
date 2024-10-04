package com.fitconnect.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.fitconnect.auth.PrincipalDetails;
import com.fitconnect.dto.TrainerDto;
import com.fitconnect.dto.UserDto;
import com.fitconnect.repository.UserDao;
import com.fitconnect.service.MessageService;
import com.fitconnect.service.TrainerService;

@RestController
public class TrainerController {
   
   @Autowired private UserDao userDao;
   
   @Autowired private TrainerService service;
   
   @Autowired private MessageService MsgService;
   
   /**********************************************************************
    * <PRE> * 메소드 정보 *
    * 1. MethodName   : trainerGetUserInfo
    * 2. ClassName      : TrainerController
    * 3. 작성자         : minji
    * 4. 작성일         : 2024. 9. 30. 오후 12:18:44
    * 5. 설명         :인증된 트레이너의 사용자 정보를 반환하는 메소드.
    * </PRE>
    *       @return Map<String,Object> - 정보를 담은 맵객체 반환.
   **********************************************************************/
   @GetMapping("/trainer/userinfo")
   public Map<String, Object> trainerGetUserInfo() {
      Authentication authentication = SecurityContextHolder.getContext().getAuthentication(); //인증 정보를 가져옴
        String userName = authentication.getName(); // 인증된 사용자의 이름을 가져옴
      return service.selectOneUserInfo(userName); // 서비스에서 사용자 정보 조회하여 반환
   }
   
   //회원의 정보를 추가하는 API 
   /**********************************************************************
    * <PRE> * 메소드 정보 *
    * 1. MethodName   : trainerSignUp
    * 2. ClassName      : TrainerController
    * 3. 작성자         : minji
    * 4. 작성일         : 2024. 9. 30. 오후 12:21:36
    * 5. 설명         : 새로운 회원(트레이너)의 정보를 등록하는 메소드. 
    * 인증된 사용자의 ID와 트레이너 번호가 일치하는 경우 정보를 DB에 저장. 등록된 트레이너 정보를 반환.
    * </PRE>
    *       @return Map<String, Object>
    *       @param dto
   **********************************************************************/
   @PostMapping ("/trainer")
   public Map<String, Object> trainerSignUp(@RequestBody TrainerDto dto) {
      Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userName = authentication.getName();
        if(userDao.getData(userName).getId() != dto.getTrainer_num()) {//사용자의 ID와 트레이너 번호의 일치를 확인
           return Map.of("isSuccess", false);     
        }
      boolean isSuccess = service.addTrainer(dto);
      return Map.of("isSuccess", isSuccess);
   }

   //회원의 정보를 삭제하는 API
   /**********************************************************************
    * <PRE> * 메소드 정보 *
    * 1. MethodName   : trainerDelete
    * 2. ClassName      : TrainerController
    * 3. 작성자         : minji
    * 4. 작성일         : 2024. 9. 30. 오후 12:43:28
    * 5. 설명         : 인증된 트레이너의 계정을 삭제하는 메소드. 
    * 서비스 계층에서 트레이너 정보를 삭제한다. 
    * </PRE>
    *       @return Map<String,Object>
   **********************************************************************/
   @DeleteMapping("/trainer")
   public Map<String, Object> trainerDelete(){
      Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userName = authentication.getName();

        UserDto userDto = ((PrincipalDetails)authentication.getPrincipal()).getDto();
        MsgService.deleteTrainerChat(userDto.getId()); //트레이너와 관련된 채팅방 정보 삭제

        boolean isSuccess =  service.deleteTrainer(userName);
      
        return Map.of("isSuccess", isSuccess);
   }

   /**********************************************************************
    * <PRE> * 메소드 정보 *
    * 1. MethodName   : getTrainer
    * 2. ClassName      : TrainerController
    * 3. 작성자         : minji
    * 4. 작성일         : 2024. 9. 30. 오후 12:48:44
    * 5. 설명         : 인증된 트레이너의 정보를 반환하는 메소드.
    * 서비스에서 트레이너 정보를 조회 후 반환한다. 
    * </PRE>
    *       @return TrainerDto
   **********************************************************************/
   @GetMapping("/trainer")
   public TrainerDto getTrainer() {
      Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userName = authentication.getName();
      return service.selectOne(userName); //서비스에서 정보 조회 후 반환
   }
      
   //회원의 정보를 수정(업데이트) 하는 API
   /**********************************************************************
    * <PRE> * 메소드 정보 *
    * 1. MethodName   : trainerUpdateInfo
    * 2. ClassName      : TrainerController
    * 3. 작성자         : minji
    * 4. 작성일         : 2024. 9. 30. 오후 12:49:52
    * 5. 설명         :트레이너의 정보를 수정, 업데이트 하는 메소드.
    * 서비스 계층에서 트레이너 정보를 업데이트. 
    * </PRE>
    *       @return void
    *       @param dto
   **********************************************************************/
   @PatchMapping("/trainer/update/info")
   public Map<String, Object> trainerUpdateInfo(@RequestBody TrainerDto dto) {
      boolean isSuccess = service.updateTrainerInfo(dto);
      return Map.of("isSuccess", isSuccess);
   }

   /**********************************************************************
    * <PRE> * 메소드 정보 *
    * 1. MethodName   : trainerUpdateGymInfo
    * 2. ClassName      : TrainerController
    * 3. 작성자         : minji
    * 4. 작성일         : 2024. 9. 30. 오후 12:52:20
    * 5. 설명         : 트레이너의 체육관 정보를 수정, 업데이트 하는 메소드.
    *서비스 계층에서 트레이너의 체육관 정보를 업데이트.
    * </PRE>
    *       @return void
    *       @param dto
   **********************************************************************/
   @PatchMapping("/trainer/update/gyminfo")
   public Map<String, Object> trainerUpdateGymInfo(@RequestBody TrainerDto dto) {
      boolean isSuccess = service.updateTrainerGymInfo(dto);
      return Map.of("isSuccess", isSuccess);
   }

   /**********************************************************************
    * <PRE> * 메소드 정보 *
    * 1. MethodName   : getTrainerList
    * 2. ClassName      : TrainerController
    * 3. 작성자         : minji
    * 4. 작성일         : 2024. 9. 30. 오후 12:53:20
    * 5. 설명         : 모든 트레이너의 목록을 반환한다. (서비스 계층에서 반환) 
    * </PRE>
    *       @return List<TrainerDto>
   **********************************************************************/
   @GetMapping("/trainer/list")
   public List<Map<String, Object>> getTrainerList(){
      return service.selectList();
   }

   /**********************************************************************
    * <PRE> * 메소드 정보 *
    * 1. MethodName   : getMemberList
    * 2. ClassName      : TrainerController
    * 3. 작성자         : minji
    * 4. 작성일         : 2024. 9. 30. 오후 12:54:07
    * 5. 설명         :현재 인증된 트레이너와 연동된 회원 목록을 반환한다. 
    * 사용자의 ID를 기반으로 서비스 계층에서 반환.
    * </PRE>
    *       @return List<Map<String,Object>>
   **********************************************************************/
   @GetMapping("/trainer/list/member")
   public List<Map<String, Object>> getMemberList(){
      Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userName = authentication.getName(); 
        int id = userDao.getData(userName).getId(); // 사용자의 ID 가져옴.
      return service.selectTrainerMemberList(id); // 서비스에서 트레이너와 연동 (담당하는) 회원 목록을 조회하여 반환
   }
}