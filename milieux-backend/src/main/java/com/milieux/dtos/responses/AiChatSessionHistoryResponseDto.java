package com.milieux.dtos.responses;

import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AiChatSessionHistoryResponseDto extends BaseResponseDto {

	private List<Object> chatHistory = new ArrayList<>();

	public AiChatSessionHistoryResponseDto(int status, boolean success, String message, List<Object> chatHistory) {
		super(status, success, message);
		this.chatHistory = chatHistory;
	}
}
