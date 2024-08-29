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

import com.milieux.dtos.requests.ChatMessageRequestDto;
import com.milieux.dtos.responses.ChatMessageListResponseDto;
import com.milieux.dtos.responses.ChatMessageResponseDto;
import com.milieux.services.ChatMessageService;
import com.milieux.services.UserService;

@RestController
@RequestMapping("/messages")
public class ChatMessageController {

	@Autowired
	private ChatMessageService chatMessageService;

	@Autowired
	private UserService userService;

	@PostMapping("create/{chatId}")
	public ResponseEntity<ChatMessageResponseDto> createChatMessage(@PathVariable Long chatId,
			@RequestBody ChatMessageRequestDto requestDto, @RequestHeader("Authorization") String header) {

		Long userId = userService.getUserFromAuthHeader(header).getUser().getId();

		ChatMessageResponseDto responseDto = chatMessageService.createChatMessage(userId, chatId, requestDto);

		return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
	}

	@GetMapping("/{chatId}")
	public ResponseEntity<ChatMessageListResponseDto> getMessagesByChatId(@PathVariable Long chatId) {

		ChatMessageListResponseDto responseDto = chatMessageService.getMessagesByChatId(chatId);

		return ResponseEntity.ok(responseDto);
	}
}
