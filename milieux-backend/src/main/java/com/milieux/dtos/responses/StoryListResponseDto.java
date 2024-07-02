package com.milieux.dtos.responses;

import java.util.List;

import com.milieux.dtos.StoryDto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StoryListResponseDto extends BaseResponseDto {

	private List<StoryDto> stories;

	public StoryListResponseDto(int status, boolean success, String message, List<StoryDto> stories) {
		super(status, success, message);
		this.stories = stories;
	}
}
