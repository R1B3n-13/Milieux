package com.milieux.services;

import com.milieux.dtos.responses.ChatListResponseDto;
import com.milieux.dtos.responses.ChatResponseDto;

public interface ChatService {

	public ChatResponseDto createChat(Long userId1, Long userId2);

	public ChatResponseDto getChatById(Long chatId);

	public ChatListResponseDto getChatsByUserId(Long userId);
}
