package com.milieux.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.milieux.models.Comment;

public interface CommentRepository extends JpaRepository<Comment, Integer> {

}
