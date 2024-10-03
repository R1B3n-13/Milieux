package com.milieux.services.impls;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.milieux.dtos.AiChatSessionDto;
import com.milieux.dtos.requests.AiChatSessionRequestDto;
import com.milieux.dtos.responses.AiChatSessionHistoryResponseDto;
import com.milieux.dtos.responses.AiChatSessionListResponseDto;
import com.milieux.dtos.responses.BaseResponseDto;
import com.milieux.exceptions.AiChatSessionNotFoundException;
import com.milieux.exceptions.UserNotFoundException;
import com.milieux.models.AiChatSession;
import com.milieux.models.User;
import com.milieux.repositories.AiChatSessionRepository;
import com.milieux.repositories.UserRepository;
import com.milieux.services.AiChatSessionService;

@Service
public class AiChatSessionServiceImpl implements AiChatSessionService {

	@Autowired
	private AiChatSessionRepository aiChatSessionRepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private ModelMapper modelMapper;

	@Override
	public BaseResponseDto createAiChatSession(Long userId, AiChatSessionRequestDto requestDto) {

		User user = userRepository.findById(userId)
				.orElseThrow(() -> new UserNotFoundException("No user present with id: " + userId));

		AiChatSession aiChatSession = modelMapper.map(requestDto, AiChatSession.class);

		aiChatSession.setUser(user);

		aiChatSessionRepository.save(aiChatSession);

		return new BaseResponseDto(201, true, "Ai chat session created successfully!");
	}

	@Override
	public AiChatSessionListResponseDto getAiChatSessionsByUserId(Long userId) {

		List<AiChatSession> aiChatSessions = aiChatSessionRepository.findAllByUserIdOrderByCreatedAtDesc(userId);

		List<AiChatSessionDto> dtos = aiChatSessions.stream()
				.map(aiChatSession -> modelMapper.map(aiChatSession, AiChatSessionDto.class))
				.collect(Collectors.toList());

		return new AiChatSessionListResponseDto(200, true, "Ai chat sessions fetched successfully!", dtos);
	}

	@Override
	public AiChatSessionHistoryResponseDto getAiChatSessionHistory(Long aiChatSessionId) {

		AiChatSession existingAiChatSession = aiChatSessionRepository.findById(aiChatSessionId)
				.orElseThrow(() -> new AiChatSessionNotFoundException("No session found with id: " + aiChatSessionId));

		return new AiChatSessionHistoryResponseDto(200, true, "Ai chat sessions fetched successfully!",
				existingAiChatSession.getChatHistory());
	}

	@Override
	public BaseResponseDto updateAiChatSessionHistory(Long aiChatSessionId, AiChatSessionRequestDto requestDto) {

		AiChatSession existingAiChatSession = aiChatSessionRepository.findById(aiChatSessionId)
				.orElseThrow(() -> new AiChatSessionNotFoundException("No session found with id: " + aiChatSessionId));

		List<Object> existingChatHistory = existingAiChatSession.getChatHistory();

		existingChatHistory.addAll(requestDto.getChatHistory());

		aiChatSessionRepository.save(existingAiChatSession);

		return new BaseResponseDto(200, true, "Chat history updated successfully!");
	}

	@Override
	public BaseResponseDto deleteAiChatSession(Long aiChatSessionId) {

		AiChatSession existingAiChatSession = aiChatSessionRepository.findById(aiChatSessionId)
				.orElseThrow(() -> new AiChatSessionNotFoundException("No session found with id: " + aiChatSessionId));

		aiChatSessionRepository.delete(existingAiChatSession);

		return new BaseResponseDto(204, true, "Ai chat session deleted successfully!");
	}
}
