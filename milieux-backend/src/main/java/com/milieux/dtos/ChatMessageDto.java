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
public class ChatMessageDto {

	private Long id;
	
	private String text;
	private String imagePath;
	
	private UserDto user;
	private ChatDto chat;
	
	private ZonedDateTime timestamp;
}
