package com.milieux.dtos.responses;

import com.milieux.dtos.StoryDto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StoryResponseDto extends BaseResponseDto {

	private StoryDto story;

	public StoryResponseDto(int status, boolean success, String message, StoryDto story) {
		super(status, success, message);
		this.story = story;
	}
}
