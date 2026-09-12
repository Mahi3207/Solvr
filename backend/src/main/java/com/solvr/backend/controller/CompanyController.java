package com.solvr.backend.controller;

import com.solvr.backend.dto.ApiResponse;
import com.solvr.backend.dto.Company.CompanyResponse;
import com.solvr.backend.dto.Company.CreateCompanyRequest;
import com.solvr.backend.dto.Company.UpdateCompanyRequest;
import com.solvr.backend.service.CompanyService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/companies")
public class CompanyController {

        private final CompanyService companyService;

        public CompanyController(CompanyService companyService) {
                this.companyService = companyService;
        }

        // CREATE
        @PostMapping
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<ApiResponse<CompanyResponse>> createCompany(
                        @Valid @RequestBody CreateCompanyRequest request) {

                CompanyResponse response = companyService.createCompany(request);

                return ResponseEntity.status(HttpStatus.CREATED)
                                .body(new ApiResponse<>(
                                                true,
                                                "Company created successfully",
                                                response));
        }

        // GET ALL
        @GetMapping
        @PreAuthorize("isAuthenticated()")
        public ResponseEntity<ApiResponse<List<CompanyResponse>>> getAllCompanies() {

                List<CompanyResponse> response = companyService.getAllCompanies();

                return ResponseEntity.ok(
                                new ApiResponse<>(
                                                true,
                                                "Companies fetched successfully",
                                                response));
        }

        // GET BY ID
        @GetMapping("/{id}")
        @PreAuthorize("isAuthenticated()")
        public ResponseEntity<ApiResponse<CompanyResponse>> getCompanyById(
                        @PathVariable Long id) {

                CompanyResponse response = companyService.getCompanyById(id);

                return ResponseEntity.ok(
                                new ApiResponse<>(
                                                true,
                                                "Company fetched successfully",
                                                response));
        }

        // UPDATE
        @PutMapping("/{id}")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<ApiResponse<CompanyResponse>> updateCompany(
                        @PathVariable Long id,
                        @Valid @RequestBody UpdateCompanyRequest request) {

                CompanyResponse response = companyService.updateCompany(id, request);

                return ResponseEntity.ok(
                                new ApiResponse<>(
                                                true,
                                                "Company updated successfully",
                                                response));
        }

        // DELETE
        @DeleteMapping("/{id}")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<ApiResponse<Object>> deleteCompany(
                        @PathVariable Long id) {

                companyService.deleteCompany(id);

                return ResponseEntity.ok(
                                new ApiResponse<>(
                                                true,
                                                "Company deleted successfully",
                                                null));
        }
}