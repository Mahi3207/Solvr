package com.solvr.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.solvr.backend.entity.Company;

public interface CompanyRepository extends JpaRepository<Company, Long> {

    Optional<Company> findByName(String name);

    boolean existsByNameIgnoreCase(String name);

    List<Company> findByNameContainingIgnoreCaseAndActiveTrue(String keyword);
}
