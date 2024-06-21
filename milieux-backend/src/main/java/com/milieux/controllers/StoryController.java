package com.milieux.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.milieux.dtos.requests.StoryRequestDto;
import com.milieux.dtos.responses.BaseResponseDto;
import com.milieux.dtos.responses.StoryListResponseDto;
import com.milieux.services.StoryService;
import com.milieux.services.UserService;

@RestController
@RequestMapping("/stories")
public class StoryController {

	@Autowired
	private StoryService storyService;

	@Autowired
	private UserService userService;

	@PostMapping("/create")
	public ResponseEntity<BaseResponseDto> createStory(@RequestBody StoryRequestDto requestDto,
			@RequestHeader("Authorization") String header) {

		Long userId = userService.getUserFromAuthHeader(header).getUser().getId();

		BaseResponseDto responseDto = storyService.createStory(requestDto, userId);

		return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
	}

	@GetMapping
	public ResponseEntity<StoryListResponseDto> getAllStories() {

		StoryListResponseDto responseDtos = storyService.getAllStories();

		return ResponseEntity.ok(responseDtos);
	}

	@GetMapping("/by-user_id/{userId}")
	public ResponseEntity<StoryListResponseDto> getStoriesByUserId(@PathVariable Long userId) {

		StoryListResponseDto responseDtos = storyService.getStoriesByUserId(userId);

		return ResponseEntity.ok(responseDtos);
	}
}
