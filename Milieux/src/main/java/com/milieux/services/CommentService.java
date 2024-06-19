package com.milieux.services;

import com.milieux.dtos.requests.CommentRequestDto;
import com.milieux.dtos.responses.BaseResponseDto;
import com.milieux.dtos.responses.CommentResponseDto;

public interface CommentService {

	public BaseResponseDto createComment(CommentRequestDto requestDto, Long postId, Long userId);

	public CommentResponseDto getCommentById(Long commentId);

	public BaseResponseDto likeComment(Long commentId, Long userId);
}
