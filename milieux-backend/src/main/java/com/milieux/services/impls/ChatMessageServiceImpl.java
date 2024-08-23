package com.milieux.services.impls;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.milieux.dtos.ChatMessageDto;
import com.milieux.dtos.requests.MessageRequestDto;
import com.milieux.dtos.responses.ChatMessageListResponseDto;
import com.milieux.dtos.responses.ChatMessageResponseDto;
import com.milieux.exceptions.ChatNotFoundException;
import com.milieux.exceptions.UserNotFoundException;
import com.milieux.models.Chat;
import com.milieux.models.ChatMessage;
import com.milieux.models.User;
import com.milieux.repositories.ChatMessageRepository;
import com.milieux.repositories.ChatRepository;
import com.milieux.repositories.UserRepository;
import com.milieux.services.ChatMessageService;

@Service
public class ChatMessageServiceImpl implements ChatMessageService {

	@Autowired
	private ChatMessageRepository chatMessageRepository;

	@Autowired
	private ChatRepository chatRepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private ModelMapper modelMapper;

	@Override
	public ChatMessageResponseDto createChatMessage(Long userId, Long chatId, MessageRequestDto requestDto) {

		User user = userRepository.findById(userId)
				.orElseThrow(() -> new UserNotFoundException("No user present with id: " + userId));

		Chat chat = chatRepository.findById(chatId)
				.orElseThrow(() -> new ChatNotFoundException("No chat present with id: " + chatId));

		ChatMessage newChatMessage = modelMapper.map(requestDto, ChatMessage.class);

		newChatMessage.setUser(user);
		newChatMessage.setChat(chat);

		ChatMessage chatMessage = chatMessageRepository.save(newChatMessage);

		ChatMessageDto dto = modelMapper.map(chatMessage, ChatMessageDto.class);

		return new ChatMessageResponseDto(200, true, "Chat message created successfully!.", dto);
	}

	@Override
	public ChatMessageListResponseDto getMessagesByChatId(Long chatId) {

		Chat chat = chatRepository.findById(chatId)
				.orElseThrow(() -> new ChatNotFoundException("No chat present with id: " + chatId));

		List<ChatMessage> chatMessages = chat.getChatMessages();

		List<ChatMessageDto> dtos = chatMessages.stream()
				.map(chatMessage -> modelMapper.map(chatMessage, ChatMessageDto.class)).collect(Collectors.toList());

		return new ChatMessageListResponseDto(200, true, "Chat messages fetched successfully!", dtos);
	}
}
