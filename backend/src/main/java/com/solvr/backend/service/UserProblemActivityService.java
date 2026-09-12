package com.solvr.backend.service;

import com.solvr.backend.dto.userproblemactivity.CreateUserProblemActivityRequest;
import com.solvr.backend.dto.userproblemactivity.UpdateUserProblemActivityRequest;
import com.solvr.backend.dto.userproblemactivity.UserProblemActivityResponse;
import com.solvr.backend.entity.Problem;
import com.solvr.backend.entity.Roadmap;
import com.solvr.backend.entity.User;
import com.solvr.backend.entity.UserProblemActivity;
import com.solvr.backend.enums.ProblemStatus;
import com.solvr.backend.exception.ProblemNotFoundException;
import com.solvr.backend.exception.RoadmapNotFoundException;
import com.solvr.backend.exception.UserNotFoundException;
import com.solvr.backend.exception.UserProblemActivityAlreadyExistsException;
import com.solvr.backend.exception.UserProblemActivityNotFoundException;
import com.solvr.backend.learningengine.service.LearningEngineService;
import com.solvr.backend.repository.ProblemRepository;
import com.solvr.backend.repository.RoadmapRepository;
import com.solvr.backend.repository.UserProblemActivityRepository;
import com.solvr.backend.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.solvr.backend.revisionengine.service.RevisionService;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserProblemActivityService {

    private final UserProblemActivityRepository userProblemActivityRepository;
    private final UserRepository userRepository;
    private final ProblemRepository problemRepository;
    private final RoadmapRepository roadmapRepository;
    private final LearningEngineService learningEngineService;
    private final RevisionService revisionService;

    public UserProblemActivityService(
            UserProblemActivityRepository userProblemActivityRepository,
            UserRepository userRepository,
            ProblemRepository problemRepository,
            RoadmapRepository roadmapRepository,
            LearningEngineService learningEngineService,
            RevisionService revisionService) {

        this.userProblemActivityRepository = userProblemActivityRepository;
        this.userRepository = userRepository;
        this.problemRepository = problemRepository;
        this.roadmapRepository = roadmapRepository;
        this.learningEngineService = learningEngineService;
        this.revisionService = revisionService;
    }
    // --------------------------------------------------
    // CREATE
    // --------------------------------------------------

    public UserProblemActivityResponse createActivity(
            CreateUserProblemActivityRequest request) {

        User user = getCurrentUser();

        Problem problem = getProblemEntity(request.getProblemId());

        if (userProblemActivityRepository.existsByUserAndProblem(user, problem)) {
            throw new UserProblemActivityAlreadyExistsException(
                    "Activity already exists for this problem");
        }

        Roadmap roadmap = null;

        if (request.getRoadmapId() != null) {
            roadmap = getRoadmapEntity(request.getRoadmapId());
        }

        UserProblemActivity activity = new UserProblemActivity();

        activity.setUser(user);
        activity.setProblem(problem);
        activity.setRoadmap(roadmap);

        activity.setStatus(request.getStatus());
        activity.setAttemptCount(request.getAttemptCount());
        activity.setTimeSpent(request.getTimeSpent());
        activity.setConfidenceLevel(request.getConfidenceLevel());
        activity.setDifficultyRating(request.getDifficultyRating());
        activity.setNotes(request.getNotes());

        activity.setBookmarked(request.getBookmarked());
        activity.setFavourite(request.getFavourite());
        activity.setNeedRevision(request.getNeedRevision());

        if (request.getStatus() == ProblemStatus.SOLVED) {
            activity.setSolvedAt(LocalDateTime.now());
        }

        UserProblemActivity saved = userProblemActivityRepository.save(activity);
        revisionService.updateRevision(saved);
        learningEngineService.calculateMastery(saved.getId());
        saved = userProblemActivityRepository
                .findById(saved.getId())
                .orElseThrow();

        return mapToResponse(saved);
    }

    // --------------------------------------------------
    // READ
    // --------------------------------------------------

    public List<UserProblemActivityResponse> getMyActivities() {

        User user = getCurrentUser();

        return userProblemActivityRepository.findByUserOrderByUpdatedAtDesc(user)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public UserProblemActivityResponse getActivityById(Long id) {

        UserProblemActivity activity = getActivityEntity(id);

        User currentUser = getCurrentUser();

        if (!activity.getUser().getId().equals(currentUser.getId())) {
            throw new UserProblemActivityNotFoundException(
                    "Activity not found");
        }

        return mapToResponse(activity);
    }
    // --------------------------------------------------
    // UPDATE
    // --------------------------------------------------

    public UserProblemActivityResponse updateActivity(
            Long id,
            UpdateUserProblemActivityRequest request) {

        User currentUser = getCurrentUser();

        UserProblemActivity activity = getActivityEntity(id);

        if (!activity.getUser().getId().equals(currentUser.getId())) {
            throw new UserProblemActivityNotFoundException(
                    "Activity not found");
        }

        Problem problem = getProblemEntity(request.getProblemId());

        Roadmap roadmap = null;

        if (request.getRoadmapId() != null) {
            roadmap = getRoadmapEntity(request.getRoadmapId());
        }

        activity.setProblem(problem);
        activity.setRoadmap(roadmap);
        activity.setStatus(request.getStatus());
        activity.setAttemptCount(request.getAttemptCount());
        activity.setTimeSpent(request.getTimeSpent());
        activity.setConfidenceLevel(request.getConfidenceLevel());
        activity.setDifficultyRating(request.getDifficultyRating());
        activity.setNotes(request.getNotes());
        activity.setBookmarked(request.getBookmarked());
        activity.setFavourite(request.getFavourite());
        activity.setNeedRevision(request.getNeedRevision());

        if (request.getStatus() == ProblemStatus.SOLVED
                && activity.getSolvedAt() == null) {

            activity.setSolvedAt(LocalDateTime.now());
        }

        UserProblemActivity updated = userProblemActivityRepository.save(activity);
        revisionService.updateRevision(updated);
        learningEngineService.calculateMastery(updated.getId());

        return mapToResponse(updated);
    }
    // --------------------------------------------------
    // DELETE
    // --------------------------------------------------

    public void deleteActivity(Long id) {

        User currentUser = getCurrentUser();

        UserProblemActivity activity = getActivityEntity(id);

        if (!activity.getUser().getId().equals(currentUser.getId())) {
            throw new UserProblemActivityNotFoundException(
                    "Activity not found");
        }

        userProblemActivityRepository.delete(activity);
    }
    // --------------------------------------------------
    // PRIVATE HELPERS
    // --------------------------------------------------

    private User getCurrentUser() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(
                        "User not found"));
    }

    private UserProblemActivity getActivityEntity(Long id) {

        return userProblemActivityRepository.findById(id)
                .orElseThrow(() -> new UserProblemActivityNotFoundException(
                        "Activity not found with id: " + id));
    }

    private Problem getProblemEntity(Long id) {
        return problemRepository.findById(id)
                .filter(problem -> Boolean.TRUE.equals(problem.getActive()))
                .orElseThrow(() -> new ProblemNotFoundException("Problem not found"));
    }

    private Roadmap getRoadmapEntity(Long id) {

        return roadmapRepository.findById(id)
                .orElseThrow(() -> new RoadmapNotFoundException(
                        "Roadmap not found with id: " + id));
    }

    private UserProblemActivityResponse mapToResponse(
            UserProblemActivity activity) {

        return new UserProblemActivityResponse(

                activity.getId(),

                activity.getUser().getId(),

                activity.getProblem().getId(),
                activity.getProblem().getTitle(),

                activity.getRoadmap() != null
                        ? activity.getRoadmap().getId()
                        : null,

                activity.getRoadmap() != null
                        ? activity.getRoadmap().getTitle()
                        : null,

                activity.getStatus(),
                activity.getAttemptCount(),
                activity.getTimeSpent(),
                activity.getConfidenceLevel(),
                activity.getDifficultyRating(),
                activity.getNotes(),
                activity.getBookmarked(),
                activity.getFavourite(),
                activity.getNeedRevision(),
                activity.getSolvedAt(),
                activity.getNextRevisionDate(),
                activity.getRevisionCount(),
                activity.getCreatedAt(),
                activity.getUpdatedAt(),
                activity.getMasteryScore(),
                activity.getLastMasteryCalculatedAt());
    }
    // --------------------------------------------------
    // QUERY APIS
    // --------------------------------------------------

    public List<UserProblemActivityResponse> getActivitiesByStatus(
            ProblemStatus status) {

        User currentUser = getCurrentUser();

        return userProblemActivityRepository
                .findByUserAndStatusOrderByUpdatedAtDesc(
                        currentUser,
                        status)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<UserProblemActivityResponse> getBookmarkedActivities() {

        User currentUser = getCurrentUser();

        return userProblemActivityRepository
                .findByUserAndBookmarkedTrueOrderByUpdatedAtDesc(currentUser)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<UserProblemActivityResponse> getFavouriteActivities() {

        User currentUser = getCurrentUser();

        return userProblemActivityRepository
                .findByUserAndFavouriteTrueOrderByUpdatedAtDesc(currentUser)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<UserProblemActivityResponse> getRevisionActivities() {

        User currentUser = getCurrentUser();

        return userProblemActivityRepository
                .findByUserAndNeedRevisionTrueOrderByUpdatedAtDesc(currentUser)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
}