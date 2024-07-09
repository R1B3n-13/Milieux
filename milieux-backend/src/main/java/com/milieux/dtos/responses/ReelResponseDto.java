package com.milieux.dtos.responses;

import com.milieux.dtos.ReelDto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReelResponseDto extends BaseResponseDto {

	private ReelDto story;

	public ReelResponseDto(int status, boolean success, String message, ReelDto story) {
		super(status, success, message);
		this.story = story;
	}
}
