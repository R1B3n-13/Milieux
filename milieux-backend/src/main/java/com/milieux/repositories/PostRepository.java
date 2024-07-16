package com.milieux.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.milieux.models.Post;

public interface PostRepository extends JpaRepository<Post, Long> {

	List<Post> findAllByOrderByCreatedAtDesc();

	List<Post> findAllById(Iterable<Long> ids);
}
