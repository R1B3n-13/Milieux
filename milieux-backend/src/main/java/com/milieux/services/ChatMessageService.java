package com.milieux.services;

import com.milieux.dtos.requests.MessageRequestDto;
import com.milieux.dtos.responses.ChatMessageListResponseDto;
import com.milieux.dtos.responses.ChatMessageResponseDto;

public interface ChatMessageService {

	public ChatMessageResponseDto createChatMessage(Long userId, Long chatId, MessageRequestDto requestDto);

	public ChatMessageListResponseDto getMessagesByChatId(Long chatId);
}
