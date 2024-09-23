package com.milieux.services;

import com.milieux.dtos.requests.AiToolRequestDto;
import com.milieux.dtos.responses.AiToolResponseDto;
import com.milieux.dtos.responses.BaseResponseDto;

public interface AiToolService {

	public BaseResponseDto createAiTool(Long userId, AiToolRequestDto requestDto);

	public AiToolResponseDto getAiTool(Long userId);
	
	public BaseResponseDto updateAiTool(AiToolRequestDto requestDto, Long userId);
}
