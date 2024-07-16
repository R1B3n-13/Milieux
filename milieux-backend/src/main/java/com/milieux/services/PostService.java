package com.milieux.services;

import java.util.List;

import com.milieux.dtos.requests.PostRequestDto;
import com.milieux.dtos.responses.BaseResponseDto;
import com.milieux.dtos.responses.PostListResponseDto;
import com.milieux.dtos.responses.PostResponseDto;

public interface PostService {

	public PostResponseDto createPost(PostRequestDto requestDto, Long userId);

	public PostListResponseDto getAllPosts();

	public PostListResponseDto getPostsByIds(List<Long> postIds);

	public PostResponseDto getPostById(Long postId);

	public PostListResponseDto getPostsByUserId(Long userId);

	public PostListResponseDto getSavedPosts(Long userId);

	public BaseResponseDto updatePost(PostRequestDto requestDto, Long postId, Long userId);

	public BaseResponseDto savePost(Long postId, Long userId);

	public BaseResponseDto likePost(Long postId, Long userId);

	public BaseResponseDto deletePost(Long postId, Long userId);
}
