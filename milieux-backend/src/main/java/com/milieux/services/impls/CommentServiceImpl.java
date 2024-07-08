package com.milieux.services.impls;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.milieux.dtos.CommentDto;
import com.milieux.dtos.requests.CommentRequestDto;
import com.milieux.dtos.responses.BaseResponseDto;
import com.milieux.dtos.responses.CommentListResponseDto;
import com.milieux.dtos.responses.CommentResponseDto;
import com.milieux.exceptions.CommentNotFoundException;
import com.milieux.exceptions.PostNotFoundException;
import com.milieux.exceptions.UserNotFoundException;
import com.milieux.models.Comment;
import com.milieux.models.Post;
import com.milieux.models.User;
import com.milieux.repositories.CommentRepository;
import com.milieux.repositories.PostRepository;
import com.milieux.repositories.UserRepository;
import com.milieux.services.CommentService;

@Service
public class CommentServiceImpl implements CommentService {

	@Autowired
	private CommentRepository commentRepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private PostRepository postRepository;

	@Autowired
	private ModelMapper modelMapper;

	@Override
	public BaseResponseDto createComment(CommentRequestDto requestDto, Long postId, Long userId) {

		User user = userRepository.findById(userId)
				.orElseThrow(() -> new UserNotFoundException("No user present with id: " + userId));

		Post post = postRepository.findById(postId)
				.orElseThrow(() -> new PostNotFoundException("No post found with id: " + postId));

		Comment comment = modelMapper.map(requestDto, Comment.class);

		comment.setUser(user);
		comment.setPost(post);

		commentRepository.save(comment);

		return new BaseResponseDto(201, true, "Comment created successfully!");
	}

	@Override
	public CommentResponseDto getCommentById(Long commentId) {

		Comment comment = commentRepository.findById(commentId)
				.orElseThrow(() -> new CommentNotFoundException("No comment found with id: " + commentId));

		CommentDto dto = modelMapper.map(comment, CommentDto.class);

		dto.setOwnerName(comment.getUser().getName());
		dto.setOwnerId(comment.getUser().getId());

		dto.setPostId(comment.getPost().getId());

		return new CommentResponseDto(200, true, "Comment fetched successfully!", dto);
	}

	@Override
	public CommentListResponseDto getCommentsByPostId(Long postId) {

		Post post = postRepository.findById(postId)
				.orElseThrow(() -> new PostNotFoundException("No post found with id: " + postId));

		List<Comment> comments = post.getComments();

		List<CommentDto> dtos = comments.stream().map(comment -> {

			CommentDto commentDto = modelMapper.map(comment, CommentDto.class);

			commentDto.setOwnerName(comment.getUser().getName());
			commentDto.setOwnerId(comment.getUser().getId());

			commentDto.setPostId(postId);

			return commentDto;

		}).collect(Collectors.toList());

		return new CommentListResponseDto(200, true, "Comments fetched successfully!", dtos);
	}

	@Override
	public BaseResponseDto likeComment(Long commentId, Long userId) {

		Comment comment = commentRepository.findById(commentId)
				.orElseThrow(() -> new CommentNotFoundException("No comment found with id: " + commentId));

		User user = userRepository.findById(userId)
				.orElseThrow(() -> new UserNotFoundException("No user present with id: " + userId));

		if (comment.getLikedByUsers().contains(user)) {

			comment.getLikedByUsers().remove(user);

			commentRepository.save(comment);

			return new BaseResponseDto(200, true, "Comment unliked successfully!");
		} else {
			comment.getLikedByUsers().add(user);

			commentRepository.save(comment);

			return new BaseResponseDto(200, true, "Comment liked successfully!");
		}
	}
}
