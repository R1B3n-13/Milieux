package com.milieux.dtos.responses;

import java.util.List;

import com.milieux.dtos.PostDto;

public class PostListResponseDto extends BaseResponseDto {

	private List<PostDto> posts;

	public PostListResponseDto() {
	}

	public PostListResponseDto(int statusCode, boolean success, String message, List<PostDto> posts) {
		super(statusCode, success, message);
		this.posts = posts;
	}

	public List<PostDto> getPosts() {
		return posts;
	}

	public void setPosts(List<PostDto> posts) {
		this.posts = posts;
	}
}
