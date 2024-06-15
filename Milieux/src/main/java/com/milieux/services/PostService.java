package com.milieux.services;

import com.milieux.dtos.responses.BaseResponseDto;
import com.milieux.dtos.responses.PostListResponseDto;
import com.milieux.dtos.responses.PostResponseDto;
import com.milieux.models.Post;

public interface PostService {

	BaseResponseDto createPost(Post post, Integer userId);

	PostListResponseDto getAllPosts();

	PostResponseDto getPostById(Integer postId);

	PostListResponseDto getPostsByUserId(Integer userId);

	BaseResponseDto savePost(Integer postId, Integer userId);

	BaseResponseDto likePost(Integer postId, Integer userId);

	BaseResponseDto deletePost(Integer postId, Integer userId);
}
