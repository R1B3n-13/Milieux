package com.milieux.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.milieux.models.Chat;
import com.milieux.models.User;

public interface ChatRepository extends JpaRepository<Chat, Long> {

	@Query("SELECT c FROM Chat c " + //
			"WHERE :user1 MEMBER OF c.users " + //
			"AND :user2 MEMBER OF c.users")
	public Chat findByUsers(@Param("user1") User user1, @Param("user2") User user2);
}
