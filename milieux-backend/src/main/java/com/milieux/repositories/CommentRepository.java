package com.milieux.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.milieux.models.Chat;
import com.milieux.models.Comment;

public interface CommentRepository extends JpaRepository<Comment, Long> {
	
	public List<Chat> findByUserId(Integer userId);
}
