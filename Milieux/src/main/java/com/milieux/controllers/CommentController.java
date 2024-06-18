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
			@PathVariable Integer postId, @RequestHeader("Authorization") String header) {

		Integer userId = userService.getUserFromAuthHeader(header).getUser().getId();

		BaseResponseDto responseDto = commentService.createComment(requestDto, postId, userId);

		return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
	}

	@GetMapping("/{commentId}")
	public ResponseEntity<CommentResponseDto> getCommentById(@PathVariable Integer commentId) {

		CommentResponseDto responseDto = commentService.getCommentById(commentId);

		return ResponseEntity.ok(responseDto);
	}

	@PutMapping("/like/{commentId}")
	public ResponseEntity<BaseResponseDto> likeComment(@PathVariable Integer commentId,
			@RequestHeader("Authorization") String header) {

		Integer userId = userService.getUserFromAuthHeader(header).getUser().getId();

		BaseResponseDto responseDto = commentService.likeComment(commentId, userId);

		return ResponseEntity.ok(responseDto);
	}
}
