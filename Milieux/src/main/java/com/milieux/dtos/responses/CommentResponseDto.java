package com.milieux.dtos.responses;

import com.milieux.dtos.CommentDto;

public class CommentResponseDto extends BaseResponseDto {

	private CommentDto commentDto;

	public CommentResponseDto() {
	}

	public CommentResponseDto(int statusCode, boolean success, String message, CommentDto commentDto) {
		super(statusCode, success, message);
		this.commentDto = commentDto;
	}

	public CommentDto getCommentDto() {
		return commentDto;
	}

	public void setCommentDto(CommentDto commentDto) {
		this.commentDto = commentDto;
	}
}
