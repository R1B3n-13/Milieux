package com.milieux.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StoryDto {

	private Long id;
	private String title;
	private String imagePath;
	private String videoPath;
}
