package com.milieux.dtos.responses;

import java.util.List;

import com.milieux.dtos.PostDto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PostListResponseDto extends BaseResponseDto {

	private List<PostDto> posts;

	public PostListResponseDto(int statusCode, boolean success, String message, List<PostDto> posts) {
		super(statusCode, success, message);
		this.posts = posts;
	}
}