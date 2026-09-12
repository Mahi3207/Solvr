package com.solvr.backend.controller;

import com.solvr.backend.entity.Company;
import com.solvr.backend.entity.Problem;
import com.solvr.backend.entity.Roadmap;
import com.solvr.backend.entity.Tag;
import com.solvr.backend.entity.Topic;
import com.solvr.backend.repository.CompanyRepository;
import com.solvr.backend.repository.ProblemRepository;
import com.solvr.backend.repository.RoadmapRepository;
import com.solvr.backend.repository.TagRepository;
import com.solvr.backend.repository.TopicRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/search")
public class SearchController {

        private final ProblemRepository problemRepository;
        private final TopicRepository topicRepository;
        private final CompanyRepository companyRepository;
        private final TagRepository tagRepository;
        private final RoadmapRepository roadmapRepository;

        public SearchController(
                        ProblemRepository problemRepository,
                        TopicRepository topicRepository,
                        CompanyRepository companyRepository,
                        TagRepository tagRepository,
                        RoadmapRepository roadmapRepository) {

                this.problemRepository = problemRepository;
                this.topicRepository = topicRepository;
                this.companyRepository = companyRepository;
                this.tagRepository = tagRepository;
                this.roadmapRepository = roadmapRepository;
        }

        @GetMapping("/problems")
        public List<Problem> searchProblems(
                        @RequestParam String keyword) {

                return problemRepository
                                .findByTitleContainingIgnoreCaseAndActiveTrue(keyword);
        }

        @GetMapping("/topics")
        public List<Topic> searchTopics(
                        @RequestParam String keyword) {

                return topicRepository
                                .findByNameContainingIgnoreCaseAndActiveTrue(keyword);
        }

        @GetMapping("/companies")
        public List<Company> searchCompanies(
                        @RequestParam String keyword) {

                return companyRepository
                                .findByNameContainingIgnoreCaseAndActiveTrue(keyword);
        }

        @GetMapping("/tags")
        public List<Tag> searchTags(
                        @RequestParam String keyword) {

                return tagRepository
                                .findByNameContainingIgnoreCaseAndActiveTrue(keyword);
        }

        @GetMapping("/roadmaps")
        public List<Roadmap> searchRoadmaps(
                        @RequestParam String keyword) {

                return roadmapRepository
                                .findByTitleContainingIgnoreCaseAndActiveTrue(keyword);
        }

}