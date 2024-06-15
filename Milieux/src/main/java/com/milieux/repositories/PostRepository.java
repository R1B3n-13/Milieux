package com.milieux.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.milieux.models.Post;

public interface PostRepository extends JpaRepository<Post, Integer> {

}
