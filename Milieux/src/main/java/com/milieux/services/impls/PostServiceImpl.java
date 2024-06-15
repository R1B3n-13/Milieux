package com.milieux.services.impls;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.milieux.dtos.responses.BaseResponseDto;
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

	@Override
	public BaseResponseDto createPost(Post post, Integer userId) {

		User user = userRepository.findById(userId)
				.orElseThrow(() -> new UserNotFoundException("No user present with id: " + userId));

		post.setUser(user);

		postRepository.save(post);

		return new BaseResponseDto(201, true, "Post created successfully!");
	}

	@Override
	public List<Post> getAllPosts() {

		return postRepository.findAll();
	}

	@Override
	public Post getPostById(Integer postId) {

		return postRepository.findById(postId)
				.orElseThrow(() -> new PostNotFoundException("No post found with id: " + postId));
	}

	@Override
	public List<Post> getPostsByUserId(Integer userId) {

		User user = userRepository.findById(userId)
				.orElseThrow(() -> new UserNotFoundException("No user present with id: " + userId));

		return user.getPosts();
	}

	@Override
	public BaseResponseDto savePost(Integer postId, Integer userId) {

		Post post = getPostById(postId);

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
	public BaseResponseDto likePost(Integer postId, Integer userId) {

		Post post = getPostById(postId);

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
	public BaseResponseDto deletePost(Integer postId, Integer userId) {

		Post post = getPostById(postId);

		User user = userRepository.findById(userId)
				.orElseThrow(() -> new UserNotFoundException("No user present with id: " + userId));

		if (post.getUser().getId() != user.getId()) {

			throw new UserNotAuthorizedException("User is not authorized to delete this post!");
		}

		postRepository.delete(post);

		return new BaseResponseDto(204, true, "Post deleted successfully!");
	}
}
