package com.milieux.dtos.requests;

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
public class AiChatSessionRequestDto {

	private String name;
	
	private List<Object> ChatHistory = new ArrayList<>();
}
