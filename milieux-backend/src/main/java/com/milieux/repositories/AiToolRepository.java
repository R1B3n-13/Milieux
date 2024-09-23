package com.milieux.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.milieux.models.AiTool;
import com.milieux.models.User;

public interface AiToolRepository extends JpaRepository<AiTool, Long> {

	public Optional<AiTool> findByUser(User user);
}
