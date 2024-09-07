package com.milieux.controllers;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class RealTimeChatController {

	@MessageMapping("/chat/{chatId}")
	@SendTo("/topic/chat/{chatId}")
	public String sendToUser(@Payload String message, @DestinationVariable String chatId) {

		return message;
	}
}
