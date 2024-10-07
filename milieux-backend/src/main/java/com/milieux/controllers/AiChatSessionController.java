package com.milieux.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.milieux.dtos.requests.AiChatSessionRequestDto;
import com.milieux.dtos.responses.AiChatSessionHistoryResponseDto;
import com.milieux.dtos.responses.AiChatSessionListResponseDto;
import com.milieux.dtos.responses.BaseResponseDto;
import com.milieux.services.AiChatSessionService;
import com.milieux.services.UserService;

@RestController
@RequestMapping("/ai-chat-session")
public class AiChatSessionController {

	@Autowired
	private AiChatSessionService aiChatSessionService;

	@Autowired
	private UserService userService;

	@PostMapping("/create/{chatbotId}")
	public ResponseEntity<BaseResponseDto> createAiChatSession(@PathVariable Long chatbotId,
			@RequestBody AiChatSessionRequestDto requestDto,
			@RequestHeader("Authorization") String header) {

		Long userId = userService.getUserFromAuthHeader(header).getUser().getId();

		BaseResponseDto responseDto = aiChatSessionService.createAiChatSession(chatbotId, userId, requestDto);

		return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
	}

	@GetMapping("/by-chatbot_id/{chatbotId}")
	public ResponseEntity<AiChatSessionListResponseDto> getAiChatSessionsByChatbotId(@PathVariable Long chatbotId,
			@RequestHeader("Authorization") String header) {

		Long userId = userService.getUserFromAuthHeader(header).getUser().getId();

		AiChatSessionListResponseDto responseDtos = aiChatSessionService.getAiChatSessionsByChatbotId(chatbotId,
				userId);

		return ResponseEntity.ok(responseDtos);
	}

	@GetMapping("/history/{aiChatSessionId}")
	public ResponseEntity<AiChatSessionHistoryResponseDto> getAiChatSessionHistory(@PathVariable Long aiChatSessionId) {

		AiChatSessionHistoryResponseDto responseDtos = aiChatSessionService.getAiChatSessionHistory(aiChatSessionId);

		return ResponseEntity.ok(responseDtos);
	}

	@PutMapping("/update/{aiChatSessionId}")
	public ResponseEntity<BaseResponseDto> updateAiChatSessionHistory(@RequestBody AiChatSessionRequestDto requestDto,
			@PathVariable Long aiChatSessionId) {

		BaseResponseDto responseDto = aiChatSessionService.updateAiChatSessionHistory(aiChatSessionId, requestDto);

		return ResponseEntity.ok(responseDto);
	}

	@DeleteMapping("/delete/{aiChatSessionId}")
	public ResponseEntity<BaseResponseDto> deleteAiChatSession(@PathVariable Long aiChatSessionId) {

		BaseResponseDto responseDto = aiChatSessionService.deleteAiChatSession(aiChatSessionId);

		return ResponseEntity.status(HttpStatus.NO_CONTENT).body(responseDto);
	}
}
