package com.solvr.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.solvr.backend.entity.Topic;

public interface TopicRepository
        extends JpaRepository<Topic, Long> {

    Optional<Topic> findByName(String name);

    boolean existsByNameIgnoreCase(String name);

    List<Topic> findByNameContainingIgnoreCaseAndActiveTrue(String keyword);
}
