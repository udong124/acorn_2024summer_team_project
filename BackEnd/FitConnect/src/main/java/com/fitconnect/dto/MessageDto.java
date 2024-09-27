package com.fitconnect.dto;

import java.awt.TrayIcon.MessageType;
import java.util.List;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Alias("messageDto")
public class MessageDto {
	private int message_id;
	private String topic;
	private String content;
	private String send_type;
	private String times;
	
	
}
