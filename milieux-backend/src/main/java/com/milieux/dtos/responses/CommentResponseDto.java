package com.milieux.dtos.responses;

import com.milieux.dtos.CommentDto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CommentResponseDto extends BaseResponseDto {

	private CommentDto comment;

	public CommentResponseDto(int status, boolean success, String message, CommentDto comment) {
		super(status, success, message);
		this.comment = comment;
	}
}
