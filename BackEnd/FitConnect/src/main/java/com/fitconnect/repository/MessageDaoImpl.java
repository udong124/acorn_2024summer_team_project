package com.fitconnect.repository;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.fitconnect.dto.ChatRoomDto;
import com.fitconnect.dto.MessageDto;

@Repository
public class MessageDaoImpl implements MessageDao {

	@Autowired private SqlSession session;
	

	//채팅방 생성
	@Override
	public boolean insertChat(ChatRoomDto dto) {
		int rowCount=session.insert("Message.insertChat", dto);
		if(rowCount>0) {
			return true;
		}else{
			return false;
		}
	}

	//채팅방 불러오기
	@Override
	public ChatRoomDto getChatRoom(int member_num) {
		return session.selectOne("Message.getChatRoom", member_num);
	}
	
	//채팅방 목록(트레이너용)
	@Override
	public List<ChatRoomDto> getChatRoomAll(int trainer_num) {
		return session.selectList("Message.getChatAll", trainer_num);
	}
	
	//채팅방 내용 조회
	@Override
	public List<MessageDto> getMessage(String topic) {
		
		return session.selectList("Message.getMsgAll", topic);
	}

	//메세지 전송
	@Override
	public boolean sendMessage(MessageDto dto) {
		int rowCount=session.insert("Message.insertMsg", dto);
		if(rowCount>0) {
			return true;
		}else{
			return false;
		}
		
	}

	//메세지 1개 삭제
	@Override
	public boolean deleteMsg(int message_id) {
		int rowCount=session.delete("Message.deleteMsg", message_id);
		if(rowCount>0) {
			return true;
		}else{
			return false;
		}
		
	}

	//채팅방 삭제(나가기)
	@Override
	public void deleteChat(String topic) {
		session.delete("Message.deleteChat", topic);
		
		
	}

	@Override
	public boolean deleteTrainerChat(int trainer_num) {
		int rowCount=session.delete("Message.deleteTrainerChat", trainer_num);
		if(rowCount>0) {
			return true;
		}else{
			return false;
		}
	}

	@Override
	public void deleteMsgAll(String topic) {
		session.delete("Message.deleteMsgAll", topic);
		
	}


	

	
	
	

}
