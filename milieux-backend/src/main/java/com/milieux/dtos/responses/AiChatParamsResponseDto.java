package com.milieux.dtos.responses;

import com.milieux.dtos.AiChatParamsDto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AiChatParamsResponseDto extends BaseResponseDto {

	private AiChatParamsDto aiChatParams;

	public AiChatParamsResponseDto(int status, boolean success, String message, AiChatParamsDto aiChatParams) {
		super(status, success, message);
		this.aiChatParams = aiChatParams;
	}
}
