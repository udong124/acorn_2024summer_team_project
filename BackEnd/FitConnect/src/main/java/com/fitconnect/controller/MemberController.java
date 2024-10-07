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
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.fitconnect.auth.PrincipalDetails;
import com.fitconnect.dto.ChatRoomDto;
import com.fitconnect.dto.MemberDto;
import com.fitconnect.dto.UserDto;
import com.fitconnect.repository.UserDao;
import com.fitconnect.service.MemberService;
import com.fitconnect.service.MessageService;

import org.springframework.web.bind.annotation.RequestParam;


@RestController
public class MemberController {
   
   @Autowired private UserDao userDao;

   @Autowired private MemberService service;
   
   @Autowired private MessageService MsgService;

   //회원의 정보를 추가하는 API 
   /**********************************************************************
    * <PRE> * 메소드 정보 *
    * 1. MethodName   : memberSignUp
    * 2. ClassName      : MemberController
    * 3. 작성자         : minji
    * 4. 작성일         : 2024. 9. 30. 오후 12:58:35
    * 5. 설명         :새로운 회원(멤버) 의 정보를 등록하는 메소드.
    * 인정된 사용자의 ID와 멤버의 번호가 일치하는 경우 정보를 DB에 저장. 등록된 멤버 정보를 반환.
    * </PRE>
    *       @return MemberDto
    *       @param dto
   **********************************************************************/
   @PostMapping ("/member")
   public Map<String, Object> memberSignUp(@RequestBody MemberDto dto) {
      Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userName = authentication.getName();
        if(userDao.getData(userName).getId() != dto.getMember_num()) { //사용자의 ID와 멤버 번호의 일치를 확인
           return Map.of("isSuccess", false);
        }
        boolean isSuccess = service.addMember(dto); //추가를 성공했는지 확인
      return Map.of("isSuccess", isSuccess);
   }
   
   //회원의 정보를 삭제하는 API
   /**********************************************************************
    * <PRE> * 메소드 정보 *
    * 1. MethodName   : memberDelete
    * 2. ClassName      : MemberController
    * 3. 작성자         : minji
    * 4. 작성일         : 2024. 9. 30. 오후 1:05:00
    * 5. 설명         : 인증된 멤버의 계정을 삭제하는 메소드
    * 서비스 계층에서 멤버의 정보를 삭제한다. 
    * </PRE>
    *       @return Map<String,Object>
   **********************************************************************/
   @DeleteMapping("/member")
   public Map<String, Object> memberDelete(){
      Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userName = authentication.getName();
        
        //채팅방 삭제
         UserDto userDto = ((PrincipalDetails)authentication.getPrincipal()).getDto();
         ChatRoomDto chatDto= MsgService.getChatRoom(userDto.getId()); 
         String topic = chatDto.getTopic();
         MsgService.deleteChat(topic);
         /*
          * 토큰 값에 담긴 MemberNum을 이용해서 해당 멤버와 멤버의 메신저 내용을 가져온 뒤, 해당 메신저의 토큰 값을 이용하여
          * 특정 멤버의 메신저 삭제. 
          */     
         //트레이너 정보 삭제
         boolean isSuccess = service.deleteMember(userName);
      return Map.of("isSuccess", isSuccess);
   }
   
   /**********************************************************************
    * <PRE> * 메소드 정보 *
    * 1. MethodName   : getMember
    * 2. ClassName      : MemberController
    * 3. 작성자         : minji
    * 4. 작성일         : 2024. 9. 30. 오후 2:39:42
    * 5. 설명         :인증된 멤버의 정보를 반환하는 메소드.
    * 서비스에서 멤버 정보를 조회 후 반환한다.
    * </PRE>
    *       @return MemberDto
    *       @return
   **********************************************************************/
   @GetMapping("/member")
   public MemberDto getMember() {
      Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userName = authentication.getName();
      return service.selectOne(userName); //서비스에서 정보 조회 후 반환
   }
      
   //회원의 정보를 수정(업데이트) 하는 API
   /**********************************************************************
    * <PRE> * 메소드 정보 *
    * 1. MethodName   : memberUpdateInfo
    * 2. ClassName      : MemberController
    * 3. 작성자         : minji
    * 4. 작성일         : 2024. 9. 30. 오후 2:40:13
    * 5. 설명         : 멤버의 정보를 수정, 업데이트 하는 메소드.
    * 서비스 계층에서 멤버 정보를 업데이트. 
    * </PRE>
    *       @return Map<String, Object>
    *       @param dto
   **********************************************************************/
   @PatchMapping("/member/update/info")
   public Map<String, Object> memberUpdateInfo(@RequestBody MemberDto dto) {
      boolean isSuccess = service.updateMemberInfo(dto); //성공 여부를 확인
      return Map.of("isSuccess", isSuccess);
   }
   
   /**********************************************************************
    * <PRE> * 메소드 정보 *
    * 1. MethodName   : memberUpdatePlan
    * 2. ClassName      : MemberController
    * 3. 작성자         : minji
    * 4. 작성일         : 2024. 9. 30. 오후 2:41:19
    * 5. 설명         : 멤버의 계획 정보를 수정, 업데이트 하는 메소드.
    * 서비스 계층에서 멤버 계획 정보를 업데이트.
    * </PRE>
    *       @return Map<String, Object>
    *       @param dto
   **********************************************************************/
   @PatchMapping("/member/update/plan")
   public Map<String, Object> memberUpdatePlan(@RequestBody MemberDto dto) {
      boolean isSuccess = service.updateMemberPlan(dto);
      return Map.of("isSuccess", isSuccess);
   }

   /**********************************************************************
    * <PRE> * 메소드 정보 *
    * 1. MethodName   : memberUpdateTrainer
    * 2. ClassName      : MemberController
    * 3. 작성자         : minji
    * 4. 작성일         : 2024. 9. 30. 오후 2:41:52
    * 5. 설명         :회원과 연동된 트레이너 정보를 업데이트하는 메소드.
    * </PRE>
    *       @return Map<String, Object>
    *       @param dto
   **********************************************************************/
   @PatchMapping("/member/update/trainer")
   public Map<String, Object> memberUpdateTrainer(@RequestBody MemberDto dto) {
      //채팅방 생성
	  int member_num=dto.getMember_num();
	  int trainer_num=dto.getTrainer_num();
	  

      ChatRoomDto chatDto= MsgService.getChatRoom(member_num); 
      String topic = chatDto.getTopic();
      MsgService.deleteChat(topic);
      
      ChatRoomDto chatDto2 = new ChatRoomDto();
      chatDto2.setMember_num(member_num);//멤버의 번호를 설정
      chatDto2.setTrainer_num(trainer_num);//트레이너의 번호를 설정
      MsgService.insertChat(chatDto2); //MsgService를 통해 새로운 채팅방 정보를 DB에 저장
      boolean isSuccess = service.updateMemberTrainer(dto);
      return Map.of("isSuccess", isSuccess);
   }

   /**********************************************************************
    * <PRE> * 메소드 정보 *
    * 1. MethodName   : getMemberList
    * 2. ClassName      : MemberController
    * 3. 작성자         : minji
    * 4. 작성일         : 2024. 9. 30. 오후 3:04:12
    * 5. 설명         :모든 멤버의 목록을 반환한다. (서비스 계층에서 반환)
    * </PRE>
    *       @return List<MemberDto>
    *       @return
   **********************************************************************/
   @GetMapping("/member/list")
   public List<MemberDto> getMemberList(){
      return service.selectList();
   }
}