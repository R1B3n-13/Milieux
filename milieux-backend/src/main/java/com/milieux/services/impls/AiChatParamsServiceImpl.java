package com.milieux.services.impls;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.milieux.dtos.AiChatParamsDto;
import com.milieux.dtos.requests.AiChatParamsRequestDto;
import com.milieux.dtos.responses.AiChatParamsResponseDto;
import com.milieux.dtos.responses.BaseResponseDto;
import com.milieux.exceptions.AiChatParamsNotFoundException;
import com.milieux.exceptions.UserNotFoundException;
import com.milieux.models.AiChatParams;
import com.milieux.models.User;
import com.milieux.repositories.AiChatParamsRepository;
import com.milieux.repositories.UserRepository;
import com.milieux.services.AiChatParamsService;

@Service
public class AiChatParamsServiceImpl implements AiChatParamsService {

	@Autowired
	private AiChatParamsRepository aiChatParamsRepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private ModelMapper modelMapper;

	@Override
	public BaseResponseDto createAiChatParams(Long userId, AiChatParamsRequestDto requestDto) {

		User user = userRepository.findById(userId)
				.orElseThrow(() -> new UserNotFoundException("No user present with id: " + userId));

		AiChatParams aiChatParams = aiChatParamsRepository.findByUser(user).orElse(null);

		if (aiChatParams == null) {

			aiChatParams = modelMapper.map(requestDto, AiChatParams.class);

			aiChatParams.setUser(user);

			aiChatParamsRepository.save(aiChatParams);

			return new BaseResponseDto(201, true, "Ai chat params created successfully!");
		} else {
			if (requestDto.getTemperature() != null) {
				aiChatParams.setTemperature(requestDto.getTemperature());
			}
			if (requestDto.getTopP() != null) {
				aiChatParams.setTopP(requestDto.getTopP());
			}
			if (requestDto.getTopK() != null) {
				aiChatParams.setTopK(requestDto.getTopK());
			}
			if (requestDto.getSystemInstruction() != null && !requestDto.getSystemInstruction().isEmpty()) {
				aiChatParams.setSystemInstruction(requestDto.getSystemInstruction());
			}
			if (requestDto.getCurrentPdfName() != null && !requestDto.getCurrentPdfName().isEmpty()) {
				aiChatParams.setCurrentPdfName(requestDto.getCurrentPdfName());
			}

			aiChatParamsRepository.save(aiChatParams);

			return new BaseResponseDto(200, true, "Ai chat params updated successfully!");
		}

	}

	@Override
	public AiChatParamsResponseDto getAiChatParams(Long userId) {

		User user = userRepository.findById(userId)
				.orElseThrow(() -> new UserNotFoundException("No user present with id: " + userId));

		AiChatParams aiChatParams = aiChatParamsRepository.findByUser(user).orElseThrow(
				() -> new AiChatParamsNotFoundException("Chat params not found for user with id: " + userId));

		AiChatParamsDto dto = modelMapper.map(aiChatParams, AiChatParamsDto.class);

		return new AiChatParamsResponseDto(200, true, "Ai chat params fetched successfully!", dto);
	}

}
