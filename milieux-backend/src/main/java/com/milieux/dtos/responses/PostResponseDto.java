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

	private PostDto post;

	public PostResponseDto(int status, boolean success, String message, PostDto post) {
		super(status, success, message);
		this.post = post;
	}
}
