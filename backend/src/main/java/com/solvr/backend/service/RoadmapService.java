package com.solvr.backend.service;

import com.solvr.backend.dto.roadmap.CreateRoadmapRequest;
import com.solvr.backend.dto.roadmap.RoadmapResponse;
import com.solvr.backend.dto.roadmap.UpdateRoadmapRequest;
import com.solvr.backend.entity.Roadmap;
import com.solvr.backend.exception.RoadmapAlreadyExistsException;
import com.solvr.backend.exception.RoadmapNotFoundException;
import com.solvr.backend.repository.RoadmapRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class RoadmapService {

    private final RoadmapRepository roadmapRepository;

    public RoadmapService(RoadmapRepository roadmapRepository) {
        this.roadmapRepository = roadmapRepository;
    }
    // --------------------------------------------------
    // CREATE
    // --------------------------------------------------

    public RoadmapResponse createRoadmap(CreateRoadmapRequest request) {

        String title = request.getTitle().trim();

        String description = request.getDescription() != null
                ? request.getDescription().trim()
                : null;

        if (roadmapRepository.existsByTitleIgnoreCase(title)) {
            throw new RoadmapAlreadyExistsException(
                    "Roadmap already exists with title: " + title);
        }

        Roadmap roadmap = new Roadmap();

        roadmap.setTitle(title);
        roadmap.setDescription(description);
        roadmap.setLevel(request.getLevel());
        roadmap.setEstimatedDuration(request.getEstimatedDuration());
        roadmap.setActive(true);

        Roadmap savedRoadmap = roadmapRepository.save(roadmap);

        return mapToResponse(savedRoadmap);
    }
    // --------------------------------------------------
    // READ
    // --------------------------------------------------

    public List<RoadmapResponse> getAllRoadmaps() {

        return roadmapRepository.findByActiveTrue()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public RoadmapResponse getRoadmapById(Long id) {

        Roadmap roadmap = getRoadmapEntity(id);

        return mapToResponse(roadmap);
    }
    // --------------------------------------------------
    // UPDATE
    // --------------------------------------------------

    public RoadmapResponse updateRoadmap(Long id, UpdateRoadmapRequest request) {

        Roadmap roadmap = getRoadmapEntity(id);

        String title = request.getTitle().trim();

        String description = request.getDescription() != null
                ? request.getDescription().trim()
                : null;

        boolean titleChanged = !roadmap.getTitle().equalsIgnoreCase(title);

        if (titleChanged
                && roadmapRepository.existsByTitleIgnoreCase(title)) {

            throw new RoadmapAlreadyExistsException(
                    "Roadmap already exists with title: " + title);
        }

        roadmap.setTitle(title);
        roadmap.setDescription(description);
        roadmap.setLevel(request.getLevel());
        roadmap.setEstimatedDuration(request.getEstimatedDuration());
        roadmap.setActive(request.getActive());

        Roadmap updatedRoadmap = roadmapRepository.save(roadmap);

        return mapToResponse(updatedRoadmap);
    }

    // --------------------------------------------------
    // DELETE
    // --------------------------------------------------

    public void deleteRoadmap(Long id) {

        Roadmap roadmap = getRoadmapEntity(id);

        roadmap.setActive(false);

        roadmapRepository.save(roadmap);
    }
    // --------------------------------------------------
    // PRIVATE HELPERS
    // --------------------------------------------------

    private Roadmap getRoadmapEntity(Long id) {

        return roadmapRepository.findById(id)
                .orElseThrow(() -> new RoadmapNotFoundException(
                        "Roadmap not found with id: " + id));
    }

    private RoadmapResponse mapToResponse(Roadmap roadmap) {

        return new RoadmapResponse(
                roadmap.getId(),
                roadmap.getTitle(),
                roadmap.getDescription(),
                roadmap.getLevel(),
                roadmap.getEstimatedDuration(),
                roadmap.getActive(),
                roadmap.getCreatedAt(),
                roadmap.getUpdatedAt());
    }

}