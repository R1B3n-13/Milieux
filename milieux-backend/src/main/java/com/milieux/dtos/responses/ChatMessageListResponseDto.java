package com.milieux.dtos.responses;

import java.util.List;

import com.milieux.dtos.ChatMessageDto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageListResponseDto extends BaseResponseDto {

	private List<ChatMessageDto> chatMessages;

	public ChatMessageListResponseDto(int status, boolean success, String message, List<ChatMessageDto> chatMessages) {
		super(status, success, message);
		this.chatMessages = chatMessages;
	}
}
