package com.milieux.services.impls;

import org.hibernate.Hibernate;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.milieux.dtos.AiToolDto;
import com.milieux.dtos.requests.AiToolRequestDto;
import com.milieux.dtos.responses.AiToolResponseDto;
import com.milieux.dtos.responses.BaseResponseDto;
import com.milieux.exceptions.AiToolNotFoundException;
import com.milieux.exceptions.UserNotFoundException;
import com.milieux.models.AiTool;
import com.milieux.models.User;
import com.milieux.repositories.AiToolRepository;
import com.milieux.repositories.UserRepository;
import com.milieux.services.AiToolService;

import jakarta.persistence.EntityManager;

@Service
@Transactional
public class AiToolServiceImpl implements AiToolService {

	@Autowired
	private AiToolRepository aiToolRepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private ModelMapper modelMapper;

	@Autowired
	private EntityManager entityManager;

	@Override
	public BaseResponseDto createAiTool(Long userId, AiToolRequestDto requestDto) {

		User user = userRepository.findById(userId)
				.orElseThrow(() -> new UserNotFoundException("No user present with id: " + userId));

		AiTool aiTool = modelMapper.map(requestDto, AiTool.class);

		aiTool.setUser(user);

		aiToolRepository.save(aiTool);

		return new BaseResponseDto(201, true, "Ai tool created successfully!");
	}

	@Override
	public AiToolResponseDto getAiTool(Long userId) {
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new UserNotFoundException("No user present with id: " + userId));

		AiTool aiTool = aiToolRepository.findByUser(user)
				.orElseThrow(() -> new AiToolNotFoundException("Ai tool not found for user with id: " + userId));

		entityManager.refresh(aiTool);

		Hibernate.initialize(aiTool.getFileData());

		AiToolDto dto = modelMapper.map(aiTool, AiToolDto.class);

		return new AiToolResponseDto(200, true, "Ai tool fetched successfully!", dto);
	}

	@Override
	public BaseResponseDto updateAiTool(AiToolRequestDto requestDto, Long userId) {

		User user = userRepository.findById(userId)
				.orElseThrow(() -> new UserNotFoundException("No user present with id: " + userId));

		AiTool aiTools = aiToolRepository.findByUser(user)
				.orElseThrow(() -> new AiToolNotFoundException("Ai tool not found for user with id: " + userId));

		if (requestDto.getFileData() != null) {
			aiTools.setFileData(requestDto.getFileData());
		}
		if (requestDto.getTemperature() != null) {
			aiTools.setTemperature(requestDto.getTemperature());
		}
		if (requestDto.getTopP() != null) {
			aiTools.setTopP(requestDto.getTopP());
		}
		if (requestDto.getTopK() != null) {
			aiTools.setTopK(requestDto.getTopK());
		}
		if (requestDto.getSystemInstruction() != null && !requestDto.getSystemInstruction().isEmpty()) {
			aiTools.setSystemInstruction(requestDto.getSystemInstruction());
		}
		if (requestDto.getCurrentFileName() != null && !requestDto.getCurrentFileName().isEmpty()) {
			aiTools.setCurrentFileName(requestDto.getCurrentFileName());
		}

		aiToolRepository.save(aiTools);

		return new BaseResponseDto(200, true, "Ai tool updated successfully!");
	}

}
