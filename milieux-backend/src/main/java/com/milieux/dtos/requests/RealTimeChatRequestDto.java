package com.milieux.dtos.requests;

import com.milieux.dtos.UserDto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RealTimeChatRequestDto {

	private UserDto user;

	private String text;
	private String imagePath;
}
