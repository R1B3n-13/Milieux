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

import com.milieux.dtos.requests.ReelRequestDto;
import com.milieux.dtos.responses.BaseResponseDto;
import com.milieux.dtos.responses.ReelListResponseDto;
import com.milieux.services.ReelService;
import com.milieux.services.UserService;

@RestController
@RequestMapping("/reels")
public class ReelController {

	@Autowired
	private ReelService storyService;

	@Autowired
	private UserService userService;

	@PostMapping("/create")
	public ResponseEntity<BaseResponseDto> createReel(@RequestBody ReelRequestDto requestDto,
			@RequestHeader("Authorization") String header) {

		Long userId = userService.getUserFromAuthHeader(header).getUser().getId();

		BaseResponseDto responseDto = storyService.createReel(requestDto, userId);

		return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
	}

	@GetMapping
	public ResponseEntity<ReelListResponseDto> getAllReels() {

		ReelListResponseDto responseDtos = storyService.getAllReels();

		return ResponseEntity.ok(responseDtos);
	}

	@GetMapping("/by-user_id/{userId}")
	public ResponseEntity<ReelListResponseDto> getReelsByUserId(@PathVariable Long userId) {

		ReelListResponseDto responseDtos = storyService.getReelsByUserId(userId);

		return ResponseEntity.ok(responseDtos);
	}
}
