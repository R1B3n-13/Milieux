package com.milieux.services.impls;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.milieux.dtos.StoryDto;
import com.milieux.dtos.requests.StoryRequestDto;
import com.milieux.dtos.responses.BaseResponseDto;
import com.milieux.dtos.responses.StoryListResponseDto;
import com.milieux.exceptions.UserNotFoundException;
import com.milieux.models.Story;
import com.milieux.models.User;
import com.milieux.repositories.StoryRepository;
import com.milieux.repositories.UserRepository;
import com.milieux.services.StoryService;

@Service
public class StoryServiceImpl implements StoryService {

	@Autowired
	private StoryRepository storyRepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private ModelMapper modelMapper;

	@Override
	public BaseResponseDto createStory(StoryRequestDto requestDto, Long userId) {

		User user = userRepository.findById(userId)
				.orElseThrow(() -> new UserNotFoundException("No user present with id: " + userId));

		Story story = modelMapper.map(requestDto, Story.class);

		story.setUser(user);

		storyRepository.save(story);

		return new BaseResponseDto(201, true, "Story created successfully!");
	}

	@Override
	public StoryListResponseDto getAllStories() {

		List<Story> stories = storyRepository.findAll();

		List<StoryDto> dtos = stories.stream().map(story -> modelMapper.map(story, StoryDto.class))
				.collect(Collectors.toList());

		return new StoryListResponseDto(200, true, "Stories fetched successfully!", dtos);
	}

	@Override
	public StoryListResponseDto getStoriesByUserId(Long userId) {

		User user = userRepository.findById(userId)
				.orElseThrow(() -> new UserNotFoundException("No user present with id: " + userId));

		List<Story> stories = user.getStories();

		List<StoryDto> dtos = stories.stream().map(story -> modelMapper.map(story, StoryDto.class))
				.collect(Collectors.toList());

		return new StoryListResponseDto(200, true, "Stories fetched successfully!", dtos);
	}
}
