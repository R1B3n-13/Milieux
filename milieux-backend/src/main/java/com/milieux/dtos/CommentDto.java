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
public class CommentDto {

	private Long id;
	private String text;
	private String imagePath;
	
	private UserDto user;

	private List<UserDto> likedByUsers = new ArrayList<>();

	private ZonedDateTime createdAt;
}
