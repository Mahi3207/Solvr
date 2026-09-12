package com.solvr.backend.service;

import com.solvr.backend.dto.topic.CreateTopicRequest;
import com.solvr.backend.dto.topic.TopicResponse;
import com.solvr.backend.dto.topic.UpdateTopicRequest;
import com.solvr.backend.entity.Topic;
import com.solvr.backend.exception.TopicAlreadyExistsException;
import com.solvr.backend.exception.TopicNotFoundException;
import com.solvr.backend.repository.TopicRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TopicService {

    private final TopicRepository topicRepository;

    public TopicService(TopicRepository topicRepository) {
        this.topicRepository = topicRepository;
    }

    public TopicResponse createTopic(CreateTopicRequest request) {

        String topicName = request.getName().trim();

        if (topicRepository.existsByNameIgnoreCase(topicName)) {
            throw new TopicAlreadyExistsException(
                    "Topic already exists");
        }

        Topic topic = new Topic();

        topic.setName(topicName);
        String description = request.getDescription();

        if (description != null) {
            description = description.trim();
        }

        topic.setDescription(description);
        topic.setDisplayOrder(request.getDisplayOrder());

        Topic savedTopic = topicRepository.save(topic);

        return mapToResponse(savedTopic);
    }

    public List<TopicResponse> getAllTopics() {

        return topicRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public TopicResponse getTopicById(Long id) {

        Topic topic = getTopicEntity(id);

        return mapToResponse(topic);
    }

    public TopicResponse updateTopic(
            Long id,
            UpdateTopicRequest request) {

        Topic topic = getTopicEntity(id);

        String topicName = request.getName().trim();

        if (!topic.getName().equalsIgnoreCase(topicName)
                && topicRepository.existsByNameIgnoreCase(topicName)) {

            throw new TopicAlreadyExistsException(
                    "Topic already exists");
        }

        topic.setName(topicName);
        topic.setDescription(request.getDescription());
        topic.setDisplayOrder(request.getDisplayOrder());
        topic.setActive(request.getActive());

        Topic updatedTopic = topicRepository.save(topic);

        return mapToResponse(updatedTopic);
    }

    public void deleteTopic(Long id) {

        Topic topic = getTopicEntity(id);

        topicRepository.delete(topic);
    }

    private Topic getTopicEntity(Long id) {

        return topicRepository.findById(id)
                .orElseThrow(() -> new TopicNotFoundException(
                        "Topic not found"));
    }

    private TopicResponse mapToResponse(
            Topic topic) {

        return new TopicResponse(
                topic.getId(),
                topic.getName(),
                topic.getDescription(),
                topic.getDisplayOrder(),
                topic.getActive(),
                topic.getCreatedAt(),
                topic.getUpdatedAt());
    }
}