package com.milieux.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.milieux.dtos.responses.BaseResponseDto;
import com.milieux.models.Post;
import com.milieux.services.PostService;
import com.milieux.services.UserService;

@RestController
@RequestMapping("/posts")
public class PostController {

	@Autowired
	private PostService postService;

	@Autowired
	private UserService userService;

	@PostMapping("/create")
	public ResponseEntity<BaseResponseDto> createPost(@RequestBody Post post,
			@RequestHeader("Authorization") String header) {

		Integer userId = userService.getUserFromAuthHeader(header).getUser().getId();

		BaseResponseDto responseDto = postService.createPost(post, userId);

		return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
	}

	@GetMapping
	public ResponseEntity<List<Post>> getAllPosts() {

		List<Post> response = postService.getAllPosts();

		return ResponseEntity.ok(response);
	}

	@GetMapping("/{postId}")
	public ResponseEntity<Post> getPostById(@PathVariable Integer postId) {

		Post response = postService.getPostById(postId);

		return ResponseEntity.ok(response);
	}

	@GetMapping("/by-user_id/{userId}")
	public ResponseEntity<List<Post>> getPostsByUserId(@PathVariable Integer userId) {

		List<Post> response = postService.getPostsByUserId(userId);

		return ResponseEntity.ok(response);
	}

	@PutMapping("/save/{postId}")
	public ResponseEntity<BaseResponseDto> savePost(@PathVariable Integer postId,
			@RequestHeader("Authorization") String header) {

		Integer userId = userService.getUserFromAuthHeader(header).getUser().getId();

		BaseResponseDto responseDto = postService.savePost(postId, userId);

		return ResponseEntity.ok(responseDto);
	}

	@PutMapping("/like/{postId}")
	public ResponseEntity<BaseResponseDto> likePost(@PathVariable Integer postId,
			@RequestHeader("Authorization") String header) {

		Integer userId = userService.getUserFromAuthHeader(header).getUser().getId();

		BaseResponseDto responseDto = postService.likePost(postId, userId);

		return ResponseEntity.ok(responseDto);
	}

	@DeleteMapping("/delete/{postId}")
	public ResponseEntity<BaseResponseDto> deletePost(@PathVariable Integer postId,
			@RequestHeader("Authorization") String header) {

		Integer userId = userService.getUserFromAuthHeader(header).getUser().getId();

		BaseResponseDto responseDto = postService.deletePost(postId, userId);

		return ResponseEntity.status(HttpStatus.NO_CONTENT).body(responseDto);
	}
}
