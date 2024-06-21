package com.milieux.services;

import com.milieux.dtos.requests.PostRequestDto;
import com.milieux.dtos.responses.BaseResponseDto;
import com.milieux.dtos.responses.PostListResponseDto;
import com.milieux.dtos.responses.PostResponseDto;

public interface PostService {

	BaseResponseDto createPost(PostRequestDto requestDto, Long userId);

	PostListResponseDto getAllPosts();

	PostResponseDto getPostById(Long postId);

	PostListResponseDto getPostsByUserId(Long userId);

	BaseResponseDto savePost(Long postId, Long userId);

	BaseResponseDto likePost(Long postId, Long userId);

	BaseResponseDto deletePost(Long postId, Long userId);
}
