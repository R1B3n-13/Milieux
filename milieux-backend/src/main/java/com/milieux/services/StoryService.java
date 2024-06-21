package com.milieux.services;

import com.milieux.dtos.requests.StoryRequestDto;
import com.milieux.dtos.responses.BaseResponseDto;
import com.milieux.dtos.responses.StoryListResponseDto;

public interface StoryService {

	public BaseResponseDto createStory(StoryRequestDto requestDto, Long userId);

	public StoryListResponseDto getAllStories();

	public StoryListResponseDto getStoriesByUserId(Long userId);
}
