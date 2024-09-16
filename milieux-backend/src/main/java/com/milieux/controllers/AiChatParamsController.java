package com.milieux.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.milieux.dtos.requests.AiChatParamsRequestDto;
import com.milieux.dtos.responses.AiChatParamsResponseDto;
import com.milieux.dtos.responses.BaseResponseDto;
import com.milieux.services.AiChatParamsService;
import com.milieux.services.UserService;

@RestController
@RequestMapping("/ai-chat/params")
public class AiChatParamsController {

	@Autowired
	private AiChatParamsService aiChatParamsService;

	@Autowired
	private UserService userService;

	@PostMapping("/create")
	public ResponseEntity<BaseResponseDto> createAiChatParams(@RequestHeader("Authorization") String header,
			@RequestBody AiChatParamsRequestDto requestDto) {

		Long userId = userService.getUserFromAuthHeader(header).getUser().getId();

		BaseResponseDto responseDto = aiChatParamsService.createAiChatParams(userId, requestDto);

		return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
	}

	@GetMapping
	public ResponseEntity<AiChatParamsResponseDto> getAiChatParams(@RequestHeader("Authorization") String header) {

		Long userId = userService.getUserFromAuthHeader(header).getUser().getId();

		AiChatParamsResponseDto responseDto = aiChatParamsService.getAiChatParams(userId);

		return ResponseEntity.ok(responseDto);
	}
}
