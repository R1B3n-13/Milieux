package com.milieux.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.milieux.models.User;

public interface UserRepository extends JpaRepository<User, Long> {

	public Optional<User> findByEmail(String email);

	@Query("SELECT u FROM User u " + //
			"WHERE LOWER(u.firstName) LIKE LOWER(:query) || '%' " + //
			"OR LOWER(u.lastName) LIKE LOWER(:query) || '%' " + //
			"OR LOWER(u.firstName) LIKE '%' || LOWER(:query) || '%' " + //
			"OR LOWER(u.lastName) LIKE '%' || LOWER(:query) || '%' " + //
			"ORDER BY " + //
			"CASE " + //
			"   WHEN LOWER(u.firstName) LIKE LOWER(:query) || '%' THEN 0 " + //
			"   WHEN LOWER(u.lastName) LIKE LOWER(:query) || '%' THEN 1 " + //
			"   WHEN LOWER(u.firstName) LIKE '%' || LOWER(:query) || '%' THEN 2 " + //
			"   ELSE 3 " + //
			"END")
	public List<User> searchUsers(@Param("query") String query);
}