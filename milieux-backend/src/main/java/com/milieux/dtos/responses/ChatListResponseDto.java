package com.milieux.dtos.responses;

import java.util.List;

import com.milieux.dtos.ChatDto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatListResponseDto extends BaseResponseDto {

	private List<ChatDto> chats;

	public ChatListResponseDto(int status, boolean success, String message, List<ChatDto> chats) {
		super(status, success, message);
		this.chats = chats;
	}
}
