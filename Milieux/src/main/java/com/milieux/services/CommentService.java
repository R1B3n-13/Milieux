package com.milieux.services;

import com.milieux.dtos.requests.CommentRequestDto;
import com.milieux.dtos.responses.BaseResponseDto;
import com.milieux.dtos.responses.CommentResponseDto;

public interface CommentService {

	public BaseResponseDto createComment(CommentRequestDto requestDto, Integer postId, Integer userId);

	public CommentResponseDto getCommentById(Integer commentId);

	public BaseResponseDto likeComment(Integer commentId, Integer userId);
}
