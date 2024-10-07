package com.milieux.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.milieux.models.AiChatSession;

public interface AiChatSessionRepository extends JpaRepository<AiChatSession, Long> {

	List<AiChatSession> findAllByUserIdAndChatbotIdOrderByCreatedAtDesc(Long userId, Long chatbotId);
}
