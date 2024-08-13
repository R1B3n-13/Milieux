package com.milieux.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.milieux.models.Post;

public interface PostRepository extends JpaRepository<Post, Long> {

	public List<Post> findAllByOrderByCreatedAtDesc();

	public List<Post> findAllById(Iterable<Long> ids);
}
