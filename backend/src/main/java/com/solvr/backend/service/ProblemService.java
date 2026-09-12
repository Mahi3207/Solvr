package com.solvr.backend.service;

import com.solvr.backend.dto.problem.CreateProblemRequest;
import com.solvr.backend.dto.problem.UpdateProblemRequest;
import com.solvr.backend.dto.problem.ProblemResponse;
import com.solvr.backend.entity.Company;
import com.solvr.backend.entity.Problem;
import com.solvr.backend.entity.Tag;
import com.solvr.backend.entity.Topic;
import com.solvr.backend.exception.CompanyNotFoundException;
import com.solvr.backend.exception.ProblemAlreadyExistsException;
import com.solvr.backend.exception.ProblemNotFoundException;
import com.solvr.backend.exception.TagNotFoundException;
import com.solvr.backend.exception.TopicNotFoundException;
import com.solvr.backend.repository.CompanyRepository;
import com.solvr.backend.repository.ProblemRepository;
import com.solvr.backend.repository.TagRepository;
import com.solvr.backend.repository.TopicRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProblemService {

    private final ProblemRepository problemRepository;
    private final TopicRepository topicRepository;
    private final CompanyRepository companyRepository;
    private final TagRepository tagRepository;

    public ProblemService(ProblemRepository problemRepository,
            TopicRepository topicRepository,
            CompanyRepository companyRepository,
            TagRepository tagRepository) {
        this.problemRepository = problemRepository;
        this.topicRepository = topicRepository;
        this.companyRepository = companyRepository;
        this.tagRepository = tagRepository;
    }

    // --------------------------------------------------
    // CREATE
    // --------------------------------------------------

    public ProblemResponse createProblem(CreateProblemRequest request) {
        String title = request.getTitle().trim();
        String description = request.getDescription() != null
                ? request.getDescription().trim()
                : null;

        if (problemRepository.existsByTitleIgnoreCaseAndPlatform(title, request.getPlatform())) {
            throw new ProblemAlreadyExistsException(
                    "Problem already exists on this platform");
        }

        Topic topic = getTopicEntity(request.getTopicId());
        Set<Company> companies = getCompanyEntities(request.getCompanyIds());
        Set<Tag> tags = getTagEntities(request.getTagIds());

        Problem problem = new Problem();
        problem.setTitle(title);
        problem.setSlug(generateSlug(title));
        problem.setDescription(description);

        problem.setDifficulty(request.getDifficulty());
        problem.setPlatform(request.getPlatform());
        problem.setProblemUrl(request.getProblemUrl());
        problem.setEstimatedTime(request.getEstimatedTime());

        problem.setPremium(request.getPremium());
        problem.setActive(true);

        problem.setTopic(topic);
        problem.setCompanies(companies);
        problem.setTags(tags);

        Problem saved = problemRepository.save(problem);
        return mapToResponse(saved);
    }

    // --------------------------------------------------
    // READ
    // --------------------------------------------------

    public List<ProblemResponse> getAllProblems() {
        return problemRepository.findByActiveTrue()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public ProblemResponse getProblemById(Long id) {
        Problem problem = getActiveProblemEntity(id);
        return mapToResponse(problem);
    }

    private Problem getActiveProblemEntity(Long id) {
        return problemRepository.findById(id)
                .filter(problem -> Boolean.TRUE.equals(problem.getActive()))
                .orElseThrow(() -> new ProblemNotFoundException("Problem not found"));
    }

    // --------------------------------------------------
    // UPDATE
    // --------------------------------------------------

    public ProblemResponse updateProblem(Long id, UpdateProblemRequest request) {
        Problem problem = getProblemEntity(id);

        String title = request.getTitle().trim();
        String description = request.getDescription() != null
                ? request.getDescription().trim()
                : null;

        boolean titleOrPlatformChanged = !problem.getTitle().equalsIgnoreCase(title)
                || !problem.getPlatform().equals(request.getPlatform());

        if (titleOrPlatformChanged
                && problemRepository.existsByTitleIgnoreCaseAndPlatform(title, request.getPlatform())) {
            throw new ProblemAlreadyExistsException(
                    "Problem already exists on this platform");
        }

        Topic topic = getTopicEntity(request.getTopicId());
        Set<Company> companies = getCompanyEntities(request.getCompanyIds());
        Set<Tag> tags = getTagEntities(request.getTagIds());

        if (!problem.getTitle().equalsIgnoreCase(title)) {
            problem.setSlug(generateSlug(title));
        }

        problem.setTitle(title);
        problem.setDescription(description);

        problem.setDifficulty(request.getDifficulty());
        problem.setPlatform(request.getPlatform());
        problem.setProblemUrl(request.getProblemUrl());
        problem.setEstimatedTime(request.getEstimatedTime());

        problem.setPremium(request.getPremium());
        problem.setActive(request.getActive());
        problem.setTopic(topic);
        problem.setCompanies(companies);
        problem.setTags(tags);

        Problem updated = problemRepository.save(problem);
        return mapToResponse(updated);
    }

    // --------------------------------------------------
    // DELETE
    // --------------------------------------------------

    public void deleteProblem(Long id) {
        Problem problem = getProblemEntity(id);
        problem.setActive(false);
        problemRepository.save(problem);
    }

    // --------------------------------------------------
    // PRIVATE HELPERS
    // --------------------------------------------------

    private Problem getProblemEntity(Long id) {
        return problemRepository.findById(id)
                .orElseThrow(() -> new ProblemNotFoundException("Problem not found"));
    }

    private Topic getTopicEntity(Long id) {
        return topicRepository.findById(id)
                .orElseThrow(() -> new TopicNotFoundException("Topic not found"));
    }

    private Set<Company> getCompanyEntities(Set<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return Set.of();
        }
        return ids.stream()
                .map(companyId -> companyRepository.findById(companyId)
                        .orElseThrow(() -> new CompanyNotFoundException(
                                "Company not found")))
                .collect(Collectors.toSet());
    }

    private Set<Tag> getTagEntities(Set<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return Set.of();
        }
        return ids.stream()
                .map(tagId -> tagRepository.findById(tagId)
                        .orElseThrow(() -> new TagNotFoundException(
                                "Tag not found")))
                .collect(Collectors.toSet());
    }

    private String generateSlug(String title) {
        String baseSlug = title
                .toLowerCase()
                .trim()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-");

        String slug = baseSlug;
        int suffix = 2;

        while (problemRepository.existsBySlug(slug)) {
            slug = baseSlug + "-" + suffix;
            suffix++;
        }

        return slug;
    }

    private ProblemResponse mapToResponse(Problem problem) {
        Set<String> companyNames = problem.getCompanies() == null
                ? Set.of()
                : problem.getCompanies().stream()
                        .map(Company::getName)
                        .collect(Collectors.toSet());

        Set<String> tagNames = problem.getTags() == null
                ? Set.of()
                : problem.getTags().stream()
                        .map(Tag::getName)
                        .collect(Collectors.toSet());

        return new ProblemResponse(
                problem.getId(),
                problem.getTitle(),
                problem.getSlug(),
                problem.getDescription(),
                problem.getDifficulty(),
                problem.getPlatform(),
                problem.getProblemUrl(),
                problem.getEstimatedTime(),
                problem.getPremium(),
                problem.getActive(),
                problem.getTopic() != null ? problem.getTopic().getId() : null,
                problem.getTopic() != null ? problem.getTopic().getName() : null,
                companyNames,
                tagNames,
                problem.getCreatedAt(),
                problem.getUpdatedAt());
    }
}