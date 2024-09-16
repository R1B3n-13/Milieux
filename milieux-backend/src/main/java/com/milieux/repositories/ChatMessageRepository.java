package com.milieux.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.milieux.models.Chat;
import com.milieux.models.ChatMessage;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
	
	public List<ChatMessage> findByChatOrderByTimestampDesc(Chat chat);
}
