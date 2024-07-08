package com.milieux.dtos.responses;

import java.util.List;

import com.milieux.dtos.CommentDto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CommentListResponseDto extends BaseResponseDto {

	private List<CommentDto> comments;
	
	public CommentListResponseDto(int status, boolean success, String message, List<CommentDto> comments) {
		super(status, success, message);
		this.comments = comments;
	}
}
