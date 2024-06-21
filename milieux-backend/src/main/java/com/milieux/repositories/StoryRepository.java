package com.milieux.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.milieux.models.Story;

public interface StoryRepository extends JpaRepository<Story, Long> {

}
