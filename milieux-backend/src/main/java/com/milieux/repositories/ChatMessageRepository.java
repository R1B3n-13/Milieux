package com.milieux.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.milieux.models.ChatMessage;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

}
