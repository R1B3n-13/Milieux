package com.milieux.dtos.responses;

import com.milieux.dtos.PostDto;

public class PostResponseDto extends BaseResponseDto {

	private PostDto postDto;

	public PostResponseDto() {
	}

	public PostResponseDto(int statusCode, boolean success, String message, PostDto postDto) {
		super(statusCode, success, message);
		this.postDto = postDto;
	}

	public PostDto getPostDto() {
		return postDto;
	}

	public void setPostDto(PostDto postDto) {
		this.postDto = postDto;
	}
}
