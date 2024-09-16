package com.milieux.services;

import com.milieux.dtos.requests.AiChatParamsRequestDto;
import com.milieux.dtos.responses.AiChatParamsResponseDto;
import com.milieux.dtos.responses.BaseResponseDto;

public interface AiChatParamsService {

	public BaseResponseDto createAiChatParams(Long userId, AiChatParamsRequestDto requestDto);

	public AiChatParamsResponseDto getAiChatParams(Long userId);
}
