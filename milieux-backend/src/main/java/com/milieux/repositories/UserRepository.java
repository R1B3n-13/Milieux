package com.milieux.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.milieux.models.User;

public interface UserRepository extends JpaRepository<User, Long> {

	public Optional<User> findByEmail(String email);

	public List<User> findAllByIsBusiness(Boolean isBusiness);

	public List<User> findAllById(Iterable<Long> ids);

	@Query("SELECT u FROM User u " + //
			"WHERE LOWER(u.name) LIKE LOWER(:query) " + //
			"OR LOWER(u.name) LIKE LOWER(:query) || '%' " + //
			"OR LOWER(u.name) LIKE '%' || LOWER(:query) || '%' " + //
			"ORDER BY " + //
			"CASE " + //
			"   WHEN LOWER(u.name) LIKE LOWER(:query) THEN 0 " + //
			"   WHEN LOWER(u.name) LIKE LOWER(:query) || '%' THEN 1 " + //
			"   ELSE 2 " + //
			"END")
	public List<User> searchUsers(@Param("query") String query);
}
