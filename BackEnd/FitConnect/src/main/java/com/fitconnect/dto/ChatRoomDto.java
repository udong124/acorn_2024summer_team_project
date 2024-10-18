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
@Alias("chatRoomDto")
public class ChatRoomDto {

	private int chat_id;//시퀀드
	private int member_num;
	private int trainer_num;
	private String topic; //문자열+chat_id _service
	
	
	private String times;
	private String content;
	private String name;
	private String profile;
}
