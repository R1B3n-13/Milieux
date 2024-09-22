package com.milieux.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.milieux.models.Post;

public interface PostRepository extends JpaRepository<Post, Long> {

	public List<Post> findAllByOrderByCreatedAtDesc();

	public List<Post> findAllByUserIdOrderByCreatedAtDesc(Long userId);

	@Query(value = "SELECT * FROM posts p " + //
			"WHERE p.id = ANY(:ids) " + //
			"ORDER BY array_position(:ids, p.id)",
			nativeQuery = true)
	List<Post> findAllByIdInOrderByIdList(@Param("ids") Long[] ids);
}
