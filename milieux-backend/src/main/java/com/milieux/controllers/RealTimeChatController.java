package com.milieux.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import com.milieux.dtos.ChatMessageDto;

public class RealTimeChatController {

	@Autowired
	private SimpMessagingTemplate simpMessagingTemplate;

	@MessageMapping("/chat/{chatId}")
	public ChatMessageDto sendToUser(@Payload ChatMessageDto message, @DestinationVariable String chatId) {
		
		System.out.println("dsadas");

		simpMessagingTemplate.convertAndSendToUser(chatId, "/private", message);

		return message;
	}
}
