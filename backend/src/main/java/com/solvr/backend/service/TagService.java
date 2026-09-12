package com.solvr.backend.service;

import com.solvr.backend.dto.tag.CreateTagRequest;
import com.solvr.backend.dto.tag.TagResponse;
import com.solvr.backend.dto.tag.UpdateTagRequest;
import com.solvr.backend.entity.Tag;
import com.solvr.backend.exception.TagAlreadyExistsException;
import com.solvr.backend.exception.TagNotFoundException;
import com.solvr.backend.repository.TagRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TagService {

    private final TagRepository tagRepository;

    public TagService(TagRepository tagRepository) {
        this.tagRepository = tagRepository;
    }

    // CREATE
    public TagResponse createTag(CreateTagRequest request) {

        String tagName = request.getName().trim();

        if (tagRepository.existsByNameIgnoreCase(tagName)) {
            throw new TagAlreadyExistsException(
                    "Tag already exists");
        }

        Tag tag = new Tag();
        tag.setName(tagName);

        Tag savedTag = tagRepository.save(tag);

        return mapToResponse(savedTag);
    }

    // GET ALL
    public List<TagResponse> getAllTags() {

        return tagRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // GET BY ID
    public TagResponse getTagById(Long id) {

        Tag tag = getTagEntity(id);

        return mapToResponse(tag);
    }

    // UPDATE
    public TagResponse updateTag(
            Long id,
            UpdateTagRequest request) {

        Tag tag = getTagEntity(id);

        String tagName = request.getName().trim();

        if (!tag.getName().equalsIgnoreCase(tagName)
                && tagRepository.existsByNameIgnoreCase(tagName)) {

            throw new TagAlreadyExistsException(
                    "Tag already exists");
        }

        tag.setName(tagName);
        tag.setActive(request.getActive());

        Tag updatedTag = tagRepository.save(tag);

        return mapToResponse(updatedTag);
    }

    // DELETE
    public void deleteTag(Long id) {

        Tag tag = getTagEntity(id);

        tagRepository.delete(tag);
    }

    private Tag getTagEntity(Long id) {

        return tagRepository.findById(id)
                .orElseThrow(() -> new TagNotFoundException(
                        "Tag not found"));
    }

    // DTO Mapper
    private TagResponse mapToResponse(Tag tag) {

        return new TagResponse(
                tag.getId(),
                tag.getName(),
                tag.getActive(),
                tag.getCreatedAt(),
                tag.getUpdatedAt());
    }
}