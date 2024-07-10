package com.milieux.services.impls;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.milieux.dtos.ReelDto;
import com.milieux.dtos.requests.ReelRequestDto;
import com.milieux.dtos.responses.BaseResponseDto;
import com.milieux.dtos.responses.ReelListResponseDto;
import com.milieux.exceptions.UserNotFoundException;
import com.milieux.models.Reel;
import com.milieux.models.User;
import com.milieux.repositories.ReelRepository;
import com.milieux.repositories.UserRepository;
import com.milieux.services.ReelService;

@Service
public class ReelServiceImpl implements ReelService {

	@Autowired
	private ReelRepository storyRepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private ModelMapper modelMapper;

	@Override
	public BaseResponseDto createReel(ReelRequestDto requestDto, Long userId) {

		User user = userRepository.findById(userId)
				.orElseThrow(() -> new UserNotFoundException("No user present with id: " + userId));

		Reel story = modelMapper.map(requestDto, Reel.class);

		story.setUser(user);

		storyRepository.save(story);

		return new BaseResponseDto(201, true, "Reel created successfully!");
	}

	@Override
	public ReelListResponseDto getAllReels() {

		List<Reel> stories = storyRepository.findAll();

		List<ReelDto> dtos = stories.stream().map(story -> modelMapper.map(story, ReelDto.class))
				.collect(Collectors.toList());

		return new ReelListResponseDto(200, true, "Reels fetched successfully!", dtos);
	}

	@Override
	public ReelListResponseDto getReelsByUserId(Long userId) {

		User user = userRepository.findById(userId)
				.orElseThrow(() -> new UserNotFoundException("No user present with id: " + userId));

		List<Reel> stories = user.getStories();

		List<ReelDto> dtos = stories.stream().map(story -> modelMapper.map(story, ReelDto.class))
				.collect(Collectors.toList());

		return new ReelListResponseDto(200, true, "Reels fetched successfully!", dtos);
	}
}
