package com.milieux.dtos;

import java.time.ZonedDateTime;

import com.milieux.models.User;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AiChatSessionDto {

	private Long id;

	private Long chatbotId;

	private String name;

	private User user;

	private ZonedDateTime createdAt;
}
