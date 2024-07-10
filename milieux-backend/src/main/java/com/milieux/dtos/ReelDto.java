package com.milieux.dtos;

import java.time.ZonedDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReelDto {

	private Long id;
	private String title;
	private String imagePath;
	private String videoPath;
	
	private UserDto user;

	private ZonedDateTime createdAt;
}
