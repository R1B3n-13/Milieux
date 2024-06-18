package com.milieux.dtos.responses;

import com.milieux.dtos.CommentDto;

public class CommentResponseDto extends BaseResponseDto {

	private CommentDto comment;

	public CommentResponseDto() {
	}

	public CommentResponseDto(int statusCode, boolean success, String message, CommentDto comment) {
		super(statusCode, success, message);
		this.comment = comment;
	}

	public CommentDto getComment() {
		return comment;
	}

	public void setComment(CommentDto comment) {
		this.comment = comment;
	}
}
