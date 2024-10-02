package com.milieux.dtos.responses;

import java.util.List;

import com.milieux.dtos.AiChatSessionDto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AiChatSessionListResponseDto extends BaseResponseDto {

	private List<AiChatSessionDto> aiChatSessions;

	public AiChatSessionListResponseDto(int status, boolean success, String message,
			List<AiChatSessionDto> aiChatSessions) {
		super(status, success, message);
		this.aiChatSessions = aiChatSessions;
	}
}
