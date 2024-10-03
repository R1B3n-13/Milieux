package com.milieux.dtos.responses;

import java.util.ArrayList;
import java.util.List;

import com.milieux.dtos.ChatHistoryItemDto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AiChatSessionHistoryResponseDto extends BaseResponseDto {

	private List<ChatHistoryItemDto> chatHistory = new ArrayList<>();

	public AiChatSessionHistoryResponseDto(int status, boolean success, String message,
			List<ChatHistoryItemDto> chatHistory) {
		super(status, success, message);
		this.chatHistory = chatHistory;
	}
}
