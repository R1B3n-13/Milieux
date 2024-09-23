package com.milieux.dtos.responses;

import com.milieux.dtos.AiToolDto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AiToolResponseDto extends BaseResponseDto {

	private AiToolDto aiTool;

	public AiToolResponseDto(int status, boolean success, String message, AiToolDto aiTool) {
		super(status, success, message);
		this.aiTool = aiTool;
	}
}
