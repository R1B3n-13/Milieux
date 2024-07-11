package com.milieux.services;

import com.milieux.dtos.requests.ReelRequestDto;
import com.milieux.dtos.responses.BaseResponseDto;
import com.milieux.dtos.responses.ReelListResponseDto;
import com.milieux.dtos.responses.ReelResponseDto;

public interface ReelService {

	public BaseResponseDto createReel(ReelRequestDto requestDto, Long userId);

	public ReelListResponseDto getAllReels();
	
	public ReelResponseDto getReelById(Long reelId);

	public ReelListResponseDto getReelsByUserId(Long userId);
}
