package com.milieux.dtos.responses;

import com.milieux.dtos.ChatMessageDto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageResponseDto extends BaseResponseDto {

	private ChatMessageDto chatMessage;

	public ChatMessageResponseDto(int status, boolean success, String message, ChatMessageDto chatMessage) {
		super(status, success, message);
		this.chatMessage = chatMessage;
	}
}
