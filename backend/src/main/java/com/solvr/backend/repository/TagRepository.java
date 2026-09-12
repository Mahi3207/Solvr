package com.solvr.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.solvr.backend.entity.Tag;

public interface TagRepository extends JpaRepository<Tag, Long> {

    Optional<Tag> findByName(String name);

    boolean existsByNameIgnoreCase(String name);

    List<Tag> findByNameContainingIgnoreCaseAndActiveTrue(String keyword);
}