package com.milieux.dtos;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PostDto {

	private Long id;
	private String caption;
	private String imagePath;
	private String videoPath;

	private List<UserDto> likedByUsers = new ArrayList<>();
	private List<CommentDto> comments = new ArrayList<>();

	private ZonedDateTime createdAt;
}
