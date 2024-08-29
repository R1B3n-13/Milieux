package com.milieux.services.impls;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.milieux.dtos.ChatDto;
import com.milieux.dtos.responses.ChatListResponseDto;
import com.milieux.dtos.responses.ChatResponseDto;
import com.milieux.exceptions.ChatNotFoundException;
import com.milieux.exceptions.UserNotFoundException;
import com.milieux.models.Chat;
import com.milieux.models.User;
import com.milieux.repositories.ChatRepository;
import com.milieux.repositories.UserRepository;
import com.milieux.services.ChatService;

@Service
public class ChatServiceImpl implements ChatService {

	@Autowired
	private ChatRepository chatRepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private ModelMapper modelMapper;

	@Override
	public ChatResponseDto createChat(Long userId1, Long userId2) {

		User user1 = userRepository.findById(userId1)
				.orElseThrow(() -> new UserNotFoundException("No user present with id: " + userId1));

		User user2 = userRepository.findById(userId2)
				.orElseThrow(() -> new UserNotFoundException("No user present with id: " + userId2));

		Chat oldChat = chatRepository.findByUsers(user1, user2);

		if (oldChat != null) {

			ChatDto dto = modelMapper.map(oldChat, ChatDto.class);

			return new ChatResponseDto(200, true, "Chat already exists.", dto);
		}

		Chat newChat = new Chat();
		newChat.getUsers().add(user1);
		newChat.getUsers().add(user2);

		Chat chat = chatRepository.save(newChat);

		ChatDto dto = modelMapper.map(chat, ChatDto.class);

		return new ChatResponseDto(200, true, "Chat created successfully!.", dto);
	}

	@Override
	public ChatResponseDto getChatById(Long chatId) {

		Chat chat = chatRepository.findById(chatId)
				.orElseThrow(() -> new ChatNotFoundException("No chat present with id: " + chatId));

		ChatDto dto = modelMapper.map(chat, ChatDto.class);

		return new ChatResponseDto(200, true, "Chat fetched successfully!", dto);
	}

	@Override
	public ChatListResponseDto getChatsByUserId(Long userId) {

		User user = userRepository.findById(userId)
				.orElseThrow(() -> new UserNotFoundException("No user present with id: " + userId));

		List<Chat> chats = user.getChats();

		List<ChatDto> dtos = chats.stream().map(chat -> modelMapper.map(chat, ChatDto.class))
				.collect(Collectors.toList());

		return new ChatListResponseDto(200, true, "Chats fetched successfully!", dtos);
	}

}
