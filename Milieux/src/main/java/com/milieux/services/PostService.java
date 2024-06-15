package com.milieux.services;

import java.util.List;

import com.milieux.dtos.responses.BaseResponseDto;
import com.milieux.models.Post;

public interface PostService {

	BaseResponseDto createPost(Post post, Integer userId);

	List<Post> getAllPosts();

	Post getPostById(Integer postId);

	List<Post> getPostsByUserId(Integer userId);

	BaseResponseDto savePost(Integer postId, Integer userId);

	BaseResponseDto likePost(Integer postId, Integer userId);

	BaseResponseDto deletePost(Integer postId, Integer userId);
}
