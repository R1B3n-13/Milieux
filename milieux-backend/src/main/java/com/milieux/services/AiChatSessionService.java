package com.milieux.services;

import com.milieux.dtos.requests.AiChatSessionRequestDto;
import com.milieux.dtos.responses.AiChatSessionHistoryResponseDto;
import com.milieux.dtos.responses.AiChatSessionListResponseDto;
import com.milieux.dtos.responses.BaseResponseDto;

public interface AiChatSessionService {

	public BaseResponseDto createAiChatSession(Long chatbotId, Long userId, AiChatSessionRequestDto requestDto);

	public AiChatSessionListResponseDto getAiChatSessionsByChatbotId(Long chatbotId, Long userId);

	public AiChatSessionHistoryResponseDto getAiChatSessionHistory(Long aiChatSessionId);

	public BaseResponseDto updateAiChatSessionHistory(Long aiChatSessionId, AiChatSessionRequestDto requestDto);

	public BaseResponseDto deleteAiChatSession(Long aiChatSessionId);
}
