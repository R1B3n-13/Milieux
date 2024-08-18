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

import com.milieux.dtos.responses.ChatListResponseDto;
import com.milieux.dtos.responses.ChatResponseDto;
import com.milieux.services.ChatService;
import com.milieux.services.UserService;

@RestController
@RequestMapping("/chats")
public class ChatController {

	@Autowired
	private ChatService chatService;

	@Autowired
	private UserService userService;

	@PostMapping("/create")
	public ResponseEntity<ChatResponseDto> createChat(@RequestBody Long userId2,
			@RequestHeader("Authorization") String header) {

		Long userId1 = userService.getUserFromAuthHeader(header).getUser().getId();

		ChatResponseDto responseDto = chatService.createChat(userId1, userId2);

		return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
	}

	@GetMapping("/{chatId}")
	public ResponseEntity<ChatResponseDto> getChatById(@PathVariable Long chatId) {

		ChatResponseDto responseDto = chatService.getChatById(chatId);

		return ResponseEntity.ok(responseDto);
	}

	@GetMapping("/by-user_id")
	public ResponseEntity<ChatListResponseDto> getChatsByUserId(@RequestHeader("Authorization") String header) {

		Long userId = userService.getUserFromAuthHeader(header).getUser().getId();

		ChatListResponseDto responseDtos = chatService.getChatsByUserId(userId);

		return ResponseEntity.ok(responseDtos);
	}
}
