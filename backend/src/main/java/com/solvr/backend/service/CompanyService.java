package com.solvr.backend.service;

import com.solvr.backend.dto.Company.CompanyResponse;
import com.solvr.backend.dto.Company.CreateCompanyRequest;
import com.solvr.backend.dto.Company.UpdateCompanyRequest;
import com.solvr.backend.entity.Company;
import com.solvr.backend.exception.CompanyAlreadyExistsException;
import com.solvr.backend.exception.CompanyNotFoundException;
import com.solvr.backend.repository.CompanyRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CompanyService {

    private final CompanyRepository companyRepository;

    public CompanyService(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    public CompanyResponse createCompany(CreateCompanyRequest request) {

        String companyName = request.getName().trim();

        if (companyRepository.existsByNameIgnoreCase(companyName)) {
            throw new CompanyAlreadyExistsException(
                    "Company already exists");
        }

        Company company = new Company();

        company.setName(companyName);

        Company savedCompany = companyRepository.save(company);

        return mapToResponse(savedCompany);
    }

    public List<CompanyResponse> getAllCompanies() {

        return companyRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public CompanyResponse getCompanyById(Long id) {

        Company company = getCompanyEntity(id);

        return mapToResponse(company);
    }

    public CompanyResponse updateCompany(
            Long id,
            UpdateCompanyRequest request) {

        Company company = getCompanyEntity(id);

        String companyName = request.getName().trim();

        if (!company.getName().equalsIgnoreCase(companyName)
                && companyRepository.existsByNameIgnoreCase(companyName)) {

            throw new CompanyAlreadyExistsException(
                    "Company already exists");
        }

        company.setName(companyName);
        company.setActive(request.getActive());

        Company updatedCompany = companyRepository.save(company);

        return mapToResponse(updatedCompany);
    }

    public void deleteCompany(Long id) {

        Company company = getCompanyEntity(id);

        companyRepository.delete(company);
    }

    private Company getCompanyEntity(Long id) {

        return companyRepository.findById(id)
                .orElseThrow(() -> new CompanyNotFoundException(
                        "Company not found"));
    }

    private CompanyResponse mapToResponse(
            Company company) {

        return new CompanyResponse(
                company.getId(),
                company.getName(),
                company.getActive(),
                company.getCreatedAt(),
                company.getUpdatedAt());
    }
}