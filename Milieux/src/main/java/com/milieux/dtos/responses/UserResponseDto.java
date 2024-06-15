package com.milieux.dtos.responses;

import com.milieux.dtos.UserDto;

public class UserResponseDto extends BaseResponseDto {

	private UserDto user;

	public UserResponseDto() {
	}

	public UserResponseDto(int statusCode, boolean success, String message, UserDto user) {
		super(statusCode, success, message);
		this.user = user;
	}

	public UserDto getUser() {
		return user;
	}

	public void setUser(UserDto user) {
		this.user = user;
	}
}
