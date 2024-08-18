package com.milieux.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.milieux.dtos.requests.CommentRequestDto;
import com.milieux.dtos.responses.BaseResponseDto;
import com.milieux.dtos.responses.CommentListResponseDto;
import com.milieux.dtos.responses.CommentResponseDto;
import com.milieux.services.CommentService;
import com.milieux.services.UserService;

@RestController
@RequestMapping("/comments")
public class CommentController {

	@Autowired
	private CommentService commentService;

	@Autowired
	UserService userService;

	@PostMapping("/create/post/{postId}")
	public ResponseEntity<BaseResponseDto> createComment(@RequestBody CommentRequestDto requestDto,
			@PathVariable Long postId, @RequestHeader("Authorization") String header) {

		Long userId = userService.getUserFromAuthHeader(header).getUser().getId();

		BaseResponseDto responseDto = commentService.createComment(requestDto, postId, userId);

		return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
	}

	@GetMapping("/{commentId}")
	public ResponseEntity<CommentResponseDto> getCommentById(@PathVariable Long commentId) {

		CommentResponseDto responseDto = commentService.getCommentById(commentId);

		return ResponseEntity.ok(responseDto);
	}
	
	@GetMapping("/by-post_id/{postId}")
	public ResponseEntity<CommentListResponseDto> getCommentsByPostId(@PathVariable Long postId) {

		CommentListResponseDto responseDtos = commentService.getCommentsByPostId(postId);

		return ResponseEntity.ok(responseDtos);
	}

	@PutMapping("/like/{commentId}")
	public ResponseEntity<BaseResponseDto> likeComment(@PathVariable Long commentId,
			@RequestHeader("Authorization") String header) {

		Long userId = userService.getUserFromAuthHeader(header).getUser().getId();

		BaseResponseDto responseDto = commentService.likeComment(commentId, userId);

		return ResponseEntity.ok(responseDto);
	}
}
