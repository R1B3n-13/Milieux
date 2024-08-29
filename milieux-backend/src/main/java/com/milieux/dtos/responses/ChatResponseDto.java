package com.milieux.dtos.responses;

import com.milieux.dtos.ChatDto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatResponseDto extends BaseResponseDto {

	private ChatDto chat;

	public ChatResponseDto(int status, boolean success, String message, ChatDto chat) {
		super(status, success, message);
		this.chat = chat;
	}
}
