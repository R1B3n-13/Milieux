package com.milieux.dtos.responses;

import com.milieux.dtos.PostDto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PostResponseDto extends BaseResponseDto {

	private PostDto postDto;

	public PostResponseDto(int statusCode, boolean success, String message, PostDto postDto) {
		super(statusCode, success, message);
		this.postDto = postDto;
	}
}
