package com.milieux.dtos.responses;

import java.util.List;

import com.milieux.dtos.ReelDto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReelListResponseDto extends BaseResponseDto {

	private List<ReelDto> reels;

	public ReelListResponseDto(int status, boolean success, String message, List<ReelDto> reels) {
		super(status, success, message);
		this.reels = reels;
	}
}
