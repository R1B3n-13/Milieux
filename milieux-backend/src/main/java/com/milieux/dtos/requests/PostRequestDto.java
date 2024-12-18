package com.milieux.dtos.requests;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PostRequestDto {

	private String text;
	private String imagePath;
	private String videoPath;
	
	private String tidbits;
	private Boolean isSafe;
}
