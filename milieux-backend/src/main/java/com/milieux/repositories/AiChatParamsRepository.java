package com.milieux.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.milieux.models.AiChatParams;
import com.milieux.models.User;

public interface AiChatParamsRepository extends JpaRepository<AiChatParams, Long> {

	public Optional<AiChatParams> findByUser(User user);
}
