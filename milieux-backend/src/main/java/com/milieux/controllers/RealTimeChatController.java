package com.milieux.controllers;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import com.milieux.dtos.requests.RealTimeChatRequestDto;

@Controller
public class RealTimeChatController {

	@MessageMapping("/chat/{chatId}")
	@SendTo("/topic/chat/{chatId}")
	public RealTimeChatRequestDto sendToUser(@Payload RealTimeChatRequestDto message,
			@DestinationVariable String chatId) {

		return message;
	}
}
