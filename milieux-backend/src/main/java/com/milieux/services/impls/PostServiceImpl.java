package com.milieux.services.impls;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.milieux.dtos.PostDto;
import com.milieux.dtos.requests.PostRequestDto;
import com.milieux.dtos.responses.BaseResponseDto;
import com.milieux.dtos.responses.PostListResponseDto;
import com.milieux.dtos.responses.PostResponseDto;
import com.milieux.exceptions.PostAlreadySavedException;
import com.milieux.exceptions.PostNotFoundException;
import com.milieux.exceptions.UserNotAuthorizedException;
import com.milieux.exceptions.UserNotFoundException;
import com.milieux.models.Post;
import com.milieux.models.User;
import com.milieux.repositories.PostRepository;
import com.milieux.repositories.UserRepository;
import com.milieux.services.PostService;

@Service
public class PostServiceImpl implements PostService {

	@Autowired
	private PostRepository postRepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private ModelMapper modelMapper;

	@Override
	public BaseResponseDto createPost(PostRequestDto requestDto, Long userId) {

		User user = userRepository.findById(userId)
				.orElseThrow(() -> new UserNotFoundException("No user present with id: " + userId));

		Post post = modelMapper.map(requestDto, Post.class);

		post.setUser(user);

		postRepository.save(post);

		return new BaseResponseDto(201, true, "Post created successfully!");
	}

	@Override
	public PostListResponseDto getAllPosts() {

		List<Post> posts = postRepository.findAllByOrderByCreatedAtDesc();

		List<PostDto> dtos = posts.stream().map(post -> {

			PostDto postDto = modelMapper.map(post, PostDto.class);

			postDto.setOwnerName(post.getUser().getName());
			postDto.setOwnerId(post.getUser().getId());
			
			postDto.setTotalComments(post.getComments().size());

			return postDto;

		}).collect(Collectors.toList());

		return new PostListResponseDto(200, true, "Posts fetched successfully!", dtos);
	}

	@Override
	public PostResponseDto getPostById(Long postId) {

		Post post = postRepository.findById(postId)
				.orElseThrow(() -> new PostNotFoundException("No post found with id: " + postId));

		PostDto dto = modelMapper.map(post, PostDto.class);

		dto.setOwnerName(post.getUser().getName());
		dto.setOwnerId(post.getUser().getId());

		return new PostResponseDto(200, true, "Post fetched successfully!", dto);
	}

	@Override
	public PostListResponseDto getPostsByUserId(Long userId) {

		User user = userRepository.findById(userId)
				.orElseThrow(() -> new UserNotFoundException("No user present with id: " + userId));

		List<Post> posts = user.getPosts();

		List<PostDto> dtos = posts.stream().map(post -> {

			PostDto postDto = modelMapper.map(post, PostDto.class);

			postDto.setOwnerName(post.getUser().getName());
			postDto.setOwnerId(post.getUser().getId());

			return postDto;

		}).collect(Collectors.toList());

		return new PostListResponseDto(200, true, "Posts fetched successfully!", dtos);
	}

	@Override
	public BaseResponseDto savePost(Long postId, Long userId) {

		Post post = postRepository.findById(postId)
				.orElseThrow(() -> new PostNotFoundException("No post found with id: " + postId));

		User user = userRepository.findById(userId)
				.orElseThrow(() -> new UserNotFoundException("No user present with id: " + userId));

		if (!user.getSavedPosts().contains(post)) {

			user.getSavedPosts().add(post);

			userRepository.save(user);

			return new BaseResponseDto(200, true, "Post saved successfully!");
		} else {
			throw new PostAlreadySavedException("Post is already saved once.");
		}

	}

	@Override
	public BaseResponseDto likePost(Long postId, Long userId) {

		Post post = postRepository.findById(postId)
				.orElseThrow(() -> new PostNotFoundException("No post found with id: " + postId));

		User user = userRepository.findById(userId)
				.orElseThrow(() -> new UserNotFoundException("No user present with id: " + userId));

		if (post.getLikedByUsers().contains(user)) {

			post.getLikedByUsers().remove(user);

			postRepository.save(post);

			return new BaseResponseDto(200, true, "Post unliked successfully!");
		} else {
			post.getLikedByUsers().add(user);

			postRepository.save(post);

			return new BaseResponseDto(200, true, "Post liked successfully!");
		}
	}

	@Override
	public BaseResponseDto deletePost(Long postId, Long userId) {

		Post post = postRepository.findById(postId)
				.orElseThrow(() -> new PostNotFoundException("No post found with id: " + postId));

		User user = userRepository.findById(userId)
				.orElseThrow(() -> new UserNotFoundException("No user present with id: " + userId));

		if (post.getUser().getId() != user.getId()) {

			throw new UserNotAuthorizedException("User is not authorized to delete this post!");
		}

		postRepository.delete(post);

		return new BaseResponseDto(204, true, "Post deleted successfully!");
	}
}
