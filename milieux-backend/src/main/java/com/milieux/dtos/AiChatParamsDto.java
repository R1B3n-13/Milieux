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
public class AiChatParamsDto {

	private Long id;

	private String currentPdfName;

	private Float temperature;
	private Float topP;
	private Integer topK;

	private String systemInstruction;

	private User user;

	private ZonedDateTime createdAt;
}
