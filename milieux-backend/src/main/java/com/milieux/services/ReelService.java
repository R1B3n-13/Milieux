package com.milieux.services;

import com.milieux.dtos.requests.ReelRequestDto;
import com.milieux.dtos.responses.BaseResponseDto;
import com.milieux.dtos.responses.ReelListResponseDto;

public interface ReelService {

	public BaseResponseDto createReel(ReelRequestDto requestDto, Long userId);

	public ReelListResponseDto getAllReels();

	public ReelListResponseDto getReelsByUserId(Long userId);
}
